const AuthService = require('../services/auth.service');
const AesService = require('../services/aes.service');
const CommonService = require('../services/common.service');
const jwtConfig = require('../config/jwt.config');
const bcryptUtil = require('../utils/bcrypt.util');
const jwtUtil = require('../utils/jwt.util');
const svgCaptcha = require('svg-captcha');

const project_base_url=CommonService.base_url(); 
 

exports.register = async (req, res) => { 

    const isExist = await AuthService.findUserByEmailLogin(req.body.email,req.body.mobile);
    
    if(isExist) {
        return res.status(200).json({ 
            status:false,
            message: 'Email/Mobile is already exists.',
            redirect:'login',
            email:req.body.email,
            mobile:req.body.mobile
           
        });
    }

    const hashedPassword = await bcryptUtil.createHash(req.body.password);
    req.body.password =  hashedPassword;
    const user = await AuthService.createUser(req.body);
    return res.json({
        status:true,
        message: 'User registered successfully.',
        result: user,
    });
}



exports.social_account_signup_login = async (req, res) => { 
    const isExist = await AuthService.findUserByEmailLogin(req.body.email);
    
    if(isExist) {}
    else{

        const userData = {
            name: req.body.name,
            email: req.body.email,
            login_type:req.body.type
           
        }        
        const user = await AuthService.createUser(userData);
       
    }
    const isExist1 = await AuthService.findUserByEmailLogin(req.body.email);

    if(isExist1){
        var ids=isExist1.dataValues.id;
        const newData = {
            status:1,
            login_type:req.body.type

        };

        const userupdate = await AuthService.updatedatabyid(ids,newData); 
        if(userupdate){

            const token = await jwtUtil.createToken({ id: ids, active_company_id:""});
            return res.json({
                status:true,
                message:'Successfully login..!',
                access_token: token,
                token_type: 'Bearer',
                expires_in: jwtConfig.ttl
            });
        }   
      
    } 
   
   return res.status(200).json({ status:false,message: 'Something went wrong..!' });   

}
 
 


exports.forgot_password_veriyemailMobile = async (req, res) => { 


    let type=req.body.type;

    if(type=='mobile'){

        const user = await AuthService.findUserByMobileForgot(req.body.login_id); 
        if (user) {
            return res.json({
                status:true,
                message: 'OTP has been sent your registered mobile..!'
            
            });
        
        }
        return res.status(200).json({ status:false,message: 'Mobile does not exists..' });
        
    }
    else{//else email
    
            const user = await AuthService.findUserByEmailForgot(req.body.login_id); 
            const date=CommonService.date();
            const checks=AesService.encrypt(req.body.login_id+'=='+date);

            const links=project_base_url+'reset-password?token='+checks;
            let data_bundle={

                link:'<a href="'+links+'">Reset password</a>',
                hash_token:checks
                 
            };
            if (user) {
                return res.json({
                    status:true,
                    message: 'Reset password link has been sent your registered mail id ..!'
                
                });
            
            }
            return res.status(200).json({ status:false,message: 'Email does not exists..' });
    }//else email
}

exports.forgot_password_veriy_otp = async (req, res) => { 

            var otp=req.body.otp;
            const user = await AuthService.findUserByMobileForgot(req.body.login_id); 
            const date=CommonService.date();

            if (user) {

                    var register_email=user.dataValues.email;
                    const checks=AesService.encrypt(register_email+'=='+date);


                    const links=project_base_url+'reset-password?token='+checks;
                    let data_bundle={

                        link:'<a href="'+links+'">Reset password</a>',
                        hash_token:checks
                        
                    };
                    if (user) {
                        return res.json({
                            status:true,
                            redirect:'login',
                            message: 'Reset password link has been sent your registered mail id ..!'
                        
                        });
                    
                    }

            }
            return res.status(200).json({ status:false,redirect:'',message: 'Mobile does not exists..' });
    
}

exports.login = async (req, res) => { 

    if(req.body.type=='email'){
        var user = await AuthService.findUserByEmail(req.body.login_id); 
        console.log("user",user);
    }
    else{
        var user = await AuthService.findUserByMobile(req.body.login_id); 
    }
    
    if (user) {

        if(user.password==''){

            return res.json({
                status:false,
                message:'User is registered from social platform please login from same..!'
                
            });
        }

        // if(user.status==0)
        // {
        //     return res.json({
        //         status:false,
        //         message:'Your account has not been approved yet, so please wait for admin approval.'
        //     });
        // }
        
        // else if(user.status==2)
        // {
        //     return res.json({
        //         status:false,
        //         message:'Your account has been blocked by the admin. Please contact support.'
        //     });
        // }
        console.log(req.body.password)
        const isMatched = await bcryptUtil.compareHash(req.body.password, user.password);
        if (isMatched) {
            const token = await jwtUtil.createToken({ id: user.id, active_company_id:"" });
            return res.json({
                status:true,
                message:'Successfully login..!',
                access_token: token,
                user_id:user.id,
                token_type: 'Bearer',
                expires_in: jwtConfig.ttl
            });
        }
    }
    return res.status(200).json({ status:false,message: 'Invalid credentials..!' });
}

exports.verify_account_signup = async (req, res) => { 

    const getdecryptData=AesService.decrypt(req.body.token);
    let email= getdecryptData.split('==');
    let emails=email[0]?email[0].trim():"";

    const user = await AuthService.findUserByEmail(emails);
    if(user){
        var ids=user.dataValues.id;
        const newData = {
            status:1
        };
        const userupdate = await AuthService.updatedatabyid(ids,newData);        
        return res.json({
            status: true,
            message: 'Successfully verified..!'
        });
    }
    return res.status(200).json({ status:false,message: 'Invalid credentials..!' });
}


exports.reset_passowrds = async (req, res) => { 

    let getToken=req.body.token;
    getToken=getToken.replace("token=","");

    const getdecryptData=AesService.decrypt(getToken);
    let email= getdecryptData.split('==');
    let emails=email[0]?email[0].trim():"";

    const user = await AuthService.findUserByEmailForgot(emails);
    if(user){

        var ids=user.dataValues.id;
        const hashedPassword = await bcryptUtil.createHash(req.body.password);
        const newData = {
            password:hashedPassword
        };

        const userupdate = await AuthService.updatedatabyid(ids,newData);        
        if(userupdate){

            return res.json({   

                status: true,
                message: 'Successfully updated..!'              
                
            });
        }
        
        
    }
    return res.status(200).json({ status:false,message: 'Invalid credentials..!' });
}

exports.getUser = async (req, res) => {
    
    const user = await AuthService.findUserById(req.user.id);  
    return res.json({
        status:true,
        message: 'Success.',
        result: user
    });
}

exports.logout = async (req, res) => {    
    await AuthService.logoutUser(req.token, req.user.exp);  
    return res.json({ status:true,message: 'Logged out successfully.' });
}

exports.captcha = async (req, res) => {    
    const captcha = svgCaptcha.create();
    const responseData = {
        status: true,
        message: 'CAPTCHA generated successfully.',
        captcha: captcha.data,
        match: captcha.text
    };
    // req.session.captcha = captcha.text; // Store the CAPTCHA text in the session
    res.type('svg');
    res.status(200).send(responseData);
};

exports.Updateprofile = async (req, res) => { 
    const user = await AuthService.updateprofilebyid(req,res);  
    return res.json({
        status:true,
        message: 'Profile Update successfully!!',
        result: user
    });        
}

exports.changePasssword = async (req, res) => { 
if(req.user.id){
    const hashedPassword = await bcryptUtil.createHash(req.body.password);
    const newData = {
        password:hashedPassword
    }
    const userupdate = await AuthService.updatedatabyid(req.user.id,newData);        
        return res.json({   
            status: true,
            message: 'Password changed successfully!'              
            
        });
}else{
    return res.status(404).json({ status:false,message: 'Invalid passwoed..!' });
}
       
    
}