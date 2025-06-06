const { Laser, User, Course } = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize } = require('sequelize');
const pdfCreator = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const os = require('os');
const moment = require('moment')



//to handle Laser data
exports.handleLaser = async (req, next) => {
    try {
        const action = req.body.action;
        return await action == 'create' ? createLaser(req, next) : updateLaser(req, next);
    } catch (err) {
        return next(err);
    }

}
//to create Laser
const createLaser = async (req, next) => {
    try {
        const { branch_id, course_id, user_id, total_amount, duo_amount, discount_amount, pay_amount, actual_amount, payment_mode,deposit_date } = req.body
        const findLastFees = await Laser.findAll({ where: { user_id: user_id, course_id: course_id}, order:[['id','DESC']] })

        const grandTotal = findLastFees.reduce((sum, record) => {
        return sum + (parseFloat(record?.dataValues?.pay_amount) || 0);
        }, 0);
        const Laser_data = await Laser.create({
            user_id:user_id,
            branch_id:branch_id,
            course_id:course_id,
            total_amount:total_amount,
            duo_amount:duo_amount,
            discount_amount:discount_amount,
            pay_amount:pay_amount,
            actual_amount:findLastFees?.length > 0 ? actual_amount-grandTotal : actual_amount,
            payment_mode:payment_mode,
            deposit_date:deposit_date
        });
        return Laser_data;
    } catch (err) {
        return next(err);

    }

}

//to update Laser
const updateLaser = async (req, next) => {
    try {
        const { branch_id, course_id, user_id, total_amount, duo_amount, discount_amount, pay_amount, actual_amount, fees_id, payment_mode,deposit_date } = req.body
        const findData = await Laser.findOne({ where: { user_id: user_id, id: fees_id } })
        if (!findData) {
            return next(new Conflict('Fees data not found'));
        } else {
            const update = await Laser.update({
                course_id: course_id,
                branch_id: branch_id,
                total_amount: total_amount,
                duo_amount: duo_amount,
                discount_amount: discount_amount,
                pay_amount: pay_amount,
                actual_amount: actual_amount,
                payment_mode: payment_mode,
                deposit_date: deposit_date,
            }, { where: { user_id: user_id, id: fees_id } })
            return update
        }
    } catch (error) {
        return next(error);
    }
}

//to get user

exports.getLegacy = async (req, next) => {
    try {
        const { page, limit, search, start_date, end_date , course_id} = req.body;
        var whereJson = {};
        const offset = (page - 1) * limit;

        // Apply search filter on associated 'User' model's name
        if (search) {
            whereJson[Op.or] = [
                { '$user_details.email$': { [Op.like]: `%${search}%` } },
                { '$user_details.name$': { [Op.like]: `%${search}%` } },
                { '$user_details.mobile$': { [Op.like]: `%${search}%` } }
            ];
        }

        // Apply date filter
        if (start_date && end_date) {
            whereJson.created_at = {
                [Op.gte]: new Date(start_date),
                [Op.lte]: new Date(`${end_date}T23:59:59`),
            };
        }
        if(course_id){
 whereJson.course_id = {
                [Op.eq]: course_id,
            };
        }

        const totalCount = await Laser.count({
            where: whereJson,
            include: [
                {
                    model: User,
                    as: 'user_details',
                    required: true, 
                },
                {
                    model: Course,
                    as: 'course_details'
                }
            ],
        });

        const totalPages = Math.ceil(totalCount / limit);

        const LegacyList = await Laser.findAll({
            where: whereJson,
            include: [
                {
                    model: User,
                    as: 'user_details',
                    required: true,
                },
                {
                    model: Course,
                    as: 'course_details'
                }
            ],
            order: [['id', 'DESC']],
            distinct: true,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        const TotalActualAmount = await Laser.findAll({
            where: {
                course_id: { [Op.not]: 5 } // Exclude course_id = 5
            },
            attributes: [
                'course_id',
                'user_id',
                'actual_amount'
            ],
            group: ['course_id', 'user_id']
        });        
        const grandTotal = TotalActualAmount.reduce((sum, record) => {
            return sum + (parseFloat(record.dataValues.actual_amount) || 0);
        }, 0);
        
        // Calculate the grand total from the grouped results
        const TotalPayAmount = await Laser.sum('pay_amount', {
            where: {
                course_id: { [Op.not]: 5 }, // Exclude course_id = 5
            },
        });
        const CorrectDueAmount = grandTotal - (parseFloat(TotalPayAmount) || 0);


         const now = new Date();
const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // this month payable fees
    const monthlyFee = await Laser.sum("pay_amount", {
      where: {
        course_id: { [Op.not]: 5 }, 
        deposit_date:{[Op.between]: [startDate, endDate]}
      },
    });

        return {
            legacyList: LegacyList,
            totalPages,
            currentPage: page,
            totalCount,
            TotalActualAmount:grandTotal,
            TotalPayAmount,
            DuoTotalamount:CorrectDueAmount,
            current_month_fees:monthlyFee
        };

    } catch (error) {
        console.error(error);
        next(error); // Pass error to middleware
    }
};



exports.getLegacyDetsils = async (req, next) => {
    try {
        const { fees_id } = req?.body
        const feesData = await Laser.findOne({
            where: { id: fees_id }
        });

        return feesData
    } catch (error) {
        next(error)
    }
}


exports.createPdf = async (req, next) => {
    try {
        const { user_id, course_id, fees_id } = req.body
        const findUserData = await User.findOne({ where: { id: user_id } })
        const findCourseData = await Course.findOne({ where: { id: course_id } })
        const findFeesData = await Laser.findOne({ where: { id: fees_id } })
        const html = fs.readFileSync(path.join(__dirname, '../../view/Pdf.html'), 'utf-8');
        const filename = Math.random() + findUserData?.name + '_doc' + '.pdf';
        const getdate = new Date().getDate()
        const getMonth = new Date().getMonth() + 1
        const getYear = new Date().getFullYear()
        const FeesDate = `${getdate}-${getMonth}-${getYear}`
        const obj = {
            userData: findUserData,
            CourseData: findCourseData,
            FeesData: findFeesData,
            FeesDate: moment(findFeesData?.deposit_date).format('DD-MM-YYYY')
        }

        var options = {
            childProcessOptions: {
                env: {
                  OPENSSL_CONF: '/dev/null',
                },
            },
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "15mm",
                contents: '<div style="text-align: center; font-weight: bold;"></div>'
            },
            footer: {
                height: "10mm",
                contents: {
                    default: '<div style="text-align: center; font-size: 10px;">Page {{page}} of {{pages}}</div>'
                }
            }
        };
        var document = {
            html: html,
            data: {
                users_detail: obj,
            },
            path: './docs/' + filename,
            type: "",
        };

        const result = await pdfCreator.create(document, options)
        const pdfUrl = `${process.env.WebUrl}/docs/${filename}`;
        

        const findDownloadCount = findFeesData?.download_time + 1

        await Laser.update({ download_time: findDownloadCount }, { where: { id: fees_id } })
        return pdfUrl
    } catch (error) {
        next(error)
    }
}


exports.FindPaidFees = async (req, next) => {
    try {
        const { course_id, user_id } = req.body;
        const data = await Laser.findAll({ where: { course_id: course_id, user_id: user_id } })
        return data
    } catch (error) {
        next(error)
    }
}
