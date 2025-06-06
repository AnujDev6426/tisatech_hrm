const { Course , Fees} = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize } = require('sequelize');


//to handle fees data
exports.handleFees = async(req ,next) => {
    const action = req.body.action;
    return await action =='create' ? createFees(req, next) : updateFees(req , next);
}

const createFees = async(req , next) => {
    try {
    const course_data = await Fees.create(req.body);
    return course_data; 
    } catch (err) {
        return next(err);
    }
     
}

const updateFees = async(req ,next)=>{
    try {
        const {branch_id,course_id,user_id,total_amount,duo_amount,discount_amount,pay_amount,actual_amount,fees_id} = req.body
        const findData = await Fees.findOne({where:{user_id:user_id , id:fees_id}})
        if(!findData){
            return next(new Conflict('Fees data not found'));
        }else{
          const update = await Fees.update({
            course_id:course_id , 
            branch_id:branch_id ,
            total_amount:total_amount,
            duo_amount:duo_amount,
            discount_amount:discount_amount,
            pay_amount:pay_amount,
            actual_amount:actual_amount
        },{where:{user_id:user_id , id:fees_id}})
          return update        
        }
    } catch (error) {
        return next(error);
    }
}


exports.getFeesList = async(req , next)=>{
    try {
       const  FeesData  = await Fees.findAll({})
       return FeesData
    } catch (error) {
        return next(error)
    }
}

exports.getFeesDetsils = async(req , next)=>{
    try {
        const {fees_id} = req?.body
        const feesData = await Fees.findOne({
            where: { id: fees_id }
          });
          
      return feesData
    } catch (error) {
       next(error)        
    }
}