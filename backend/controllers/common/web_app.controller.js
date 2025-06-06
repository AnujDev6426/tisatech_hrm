var request = require('request');
const WebAppService = require('../../services/common/web_app.service');

exports.getDatas = async (req, res) => { 
   
    const datas_check_1 = await WebAppService.findUserByEmailLogin('stage_1');

    var NewArrays=[];

    let main_data = {
        stage_1: [],
        register_seller_buyer: [],
        continue_seller_buyer: []
    };

    if(datas_check_1){ 

        var datas_1=datas_check_1.dataValues.datas;
       
        var conevrstArraysParsee=JSON.parse(datas_1);  
        for (let i in conevrstArraysParsee
        ) {
            let item = conevrstArraysParsee[i];
            
            main_data.stage_1.push({
                "title": item.title,
                "image": item.image
               
            });
        }
    }
    const datas_check_2 = await WebAppService.findUserByEmailLogin('stage_2');
    if(datas_check_2){

        var datas_2=datas_check_2.dataValues.datas;       
        var conevrstArraysParse2=JSON.parse(datas_2);
      
         
         var datas_2_content=conevrstArraysParse2.image;
        
         main_data['stage_2']=datas_2_content;
    }
    const datas_check_3 = await WebAppService.findUserByEmailLogin('login');
    if(datas_check_3){

        var datas_3=datas_check_3.dataValues.datas;       
        var conevrstArraysParse2=JSON.parse(datas_3);       

        var datas_login_content=conevrstArraysParse2.image;        
        main_data['login']=datas_login_content;
    }

    const datas_check_4 = await WebAppService.findUserByEmailLogin('forgot_password');
    if(datas_check_4){

        var datas_4=datas_check_4.dataValues.datas;       
        var conevrstArraysParse2=JSON.parse(datas_4);
       

        var datas_fogot_content=conevrstArraysParse2.image;        
        main_data['forgot_password']=datas_fogot_content;
    }

    const datas_check_5 = await WebAppService.findUserByEmailLogin('otp_forgot');
    if(datas_check_4){

        var datas_5=datas_check_5.dataValues.datas;       
        var conevrstArraysParse2=JSON.parse(datas_5);       

        var datas_otp_content=conevrstArraysParse2.image;        
        main_data['otp_forgot']=datas_otp_content;
    }

    const datas_check_6 = await WebAppService.findUserByEmailLogin('register_seller_buyer');
    if(datas_check_6){ 

        var datas_6=datas_check_6.dataValues.datas;
       
        var conevrstArraysParsee=JSON.parse(datas_6);  
        for (let i in conevrstArraysParsee
        ) {
            let item = conevrstArraysParsee[i];
            
            main_data.register_seller_buyer.push({
                "title": item.title,
                "image": item.image
               
            });
        }
    }

    const datas_check_7 = await WebAppService.findUserByEmailLogin('continue_seller_buyer');
    if(datas_check_7){

        var datas_7=datas_check_7.dataValues.datas;       
        var conevrstArraysParse2=JSON.parse(datas_7);
        main_data.continue_seller_buyer.push({
            "title": conevrstArraysParse2.title,
            "image": conevrstArraysParse2.image
        });
    }

    return res.json({
        status: true,
        message: 'ok',
        data:main_data
        
    });
    

} 
