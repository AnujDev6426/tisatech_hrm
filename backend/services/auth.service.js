const {
    User,PermissionAssign,Permissions
    } = require('../models/connection.js');
const cacheUtil = require('../utils/cache.util');
const { Op } = require('sequelize');

exports.createUser = (user) => {
    console.log("req.body",user);
    return User.create(user);
}

exports.findUserByEmail = (email) => {
    console.log(email)
    return User.findOne({ 
        where: {
            email: email,

        },    }) 
}

exports.findUserByMobile = (mobile) => {
    return User.findOne({ 
        where: {
            mobile: mobile,
        },
           }) 
}


exports.findUserByEmailLogin = (email,mobile) => {
    return User.findOne({

        where: {
            [Op.or]: [
                { email: email },
                { mobile: mobile }
            ]
        }
    }) 
}
 exports.findUserByEmailForgot = (email) => {

    return User.findOne({
        where: {
            email: email
           
        }
    }) 
   
}
 exports.findUserByMobileForgot = (mobile) => {

    return User.findOne({
        where: {
            mobile: mobile
           
        }
    }) 
   
}
exports.updatedatabyid = (id,newData) => {
   
    try {
        User.update(newData, {
            where: {
                id: id
            }
        });
        return true; 
    } 
    catch (error) {
       
        return error;
    }

}

exports.findUserById = (id) => {
    return User.findOne({
        where: { id },
          order: [['id', 'ASC']],
    });
};


exports.logoutUser = (token, exp) => {
    const now = new Date();
    const expire = new Date(exp * 1000);
    const milliseconds = expire.getTime() - now.getTime();
    /* ----------------------------- BlackList Token ---------------------------- */
    return cacheUtil.set(token, token, milliseconds);
}

exports.updateprofilebyid = (req,res) => {
   const {name,email,mobile,user_profile}=req.body
   console.log(req.file)
    try {
        User.update({name,email,mobile,user_profile}, {
            where: {
                id: req.user.id
            }
        });
        return true; 
    } 
    catch (error) {
       
        return false;
    }

}