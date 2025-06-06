const {
  User,
  Course,
  Batch,
  Laser,
  Fees,
  AssignCourse,
} = require("../../models/connection.js");
const { Conflict, BadRequestError } = require("../../utils/api-errors.js");
const { Op, Sequelize } = require("sequelize");

exports.getDetails = async (req, next) => {
  try {
    // Fetch active students count
    const activeStudentsCount = await User.count({
      where: { status: "Y", role_id: 2 },
    });

    // Fetch active batches count
    const activeBatchesCount = await Batch.count({ where: { status: "Y" } });
    const findOneData = await Course.findOne({ where: { sort_name: "bca" } });
    const activeBCAStudentsCount = await User.count({
      where: {
        role_id: 2, // Add this condition to fetch users with role_id 2
      },
      include: [
        {
          model: AssignCourse,
          as: "course_details",
          where: { course_id: findOneData.id },
        },
      ],
    }); // Fetch total collection
    const TotalPayAmount = await Laser.findAll({
      attributes: ["course_id", "user_id", "actual_amount"],
      group: ["course_id", "user_id"],
    });

    const grandTotal = TotalPayAmount.reduce((sum, record) => {
      return sum + (parseFloat(record.dataValues.actual_amount) || 0);
    }, 0);

    return {
      activeStudentsCount,
      activeBatchesCount,
      activeBCAStudentsCount,
      totalCollection: grandTotal,
    };
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// findby id course List
exports.CourseFindList = async (req, next) => {
  try {
    const courseUserCounts = await AssignCourse.findAll({
      attributes: [
        "course_id",
        [Sequelize.fn("COUNT", Sequelize.col("user_id")), "userCount"],
      ],
      include: [
        {
          model: Course,
          as: "course_details",
          required: true,
          attributes: ["name", "fees", "id"],
        },
      ],
      group: ["course_id", "course_details.id"],
    });

    return courseUserCounts;
  } catch (error) {}
};

//to get 10 last studnet to bca
exports.getAllBCAStudent = async (req, next) => {
  try {
    const findOneData = await Course.findOne({ where: { sort_name: "BCA" } });

    const data = await AssignCourse.findAll({
      where: { course_id: findOneData.id },
      include: [
        {
          model: User,
          as: "user_details",
        },
      ],
      order: [["id", "DESC"]], // Order by ID descending
      limit: parseInt(10),
    });
    const TotalActualAmount = await Laser.findAll({
      where: {
        course_id: 5, // Exclude course_id = 5
      },
      attributes: ["course_id", "user_id", "actual_amount"],
      group: ["course_id", "user_id"],
    });
    const grandTotal = TotalActualAmount.reduce((sum, record) => {
      return sum + (parseFloat(record.dataValues.actual_amount) || 0);
    }, 0);
    // Calculate the grand total from the grouped results
    const TotalPayAmount = await Laser.sum("pay_amount", {
      where: {
        course_id: 5,
      }, // Exclude course_id = 5
    });

    const CorrectDueAmount = grandTotal - TotalPayAmount;

    return {
      List: data,
      TotalActualAmount: grandTotal,
      TotalPayAmount,
      DuoTotalamount: CorrectDueAmount,
    };
  } catch (error) {
    console.log(error);
    next(error); // Pass the error to the next middleware
  }
};

// course total sum
exports.getLaserDetails = async (req, next) => {
  try {
    const TotalActualAmount = await Laser.findAll({
      where: {
        course_id: { [Op.not]: 5 }, // Exclude course_id = 5
      },
      attributes: ["course_id", "user_id", "actual_amount"],
      group: ["course_id", "user_id"],
    });
    const grandTotal = TotalActualAmount.reduce((sum, record) => {
      return sum + (parseFloat(record.dataValues.actual_amount) || 0);
    }, 0);

    // Calculate the grand total from the grouped results
    const TotalPayAmount = await Laser.sum("pay_amount", {
      where: {
        course_id: { [Op.not]: 5 }, // Exclude course_id = 5
      },
    });

    const now = new Date();
const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // this month payable fees
    const monthLyFee = await Laser.sum("pay_amount", {
      where: {
        course_id: { [Op.not]: 5 }, 
        deposit_date:{[Op.between]: [startDate, endDate]}
      },
    });
    const CorrectDueAmount = grandTotal - (parseFloat(TotalPayAmount) || 0);
    
    return {
      TotalActualAmount: grandTotal,
      TotalPayAmount,
      DuoTotalamount: CorrectDueAmount,
      current_Month:monthLyFee
    };
  } catch (error) {
    console.log(error);
    next(error); // Pass the error to the next middleware
  }
};
