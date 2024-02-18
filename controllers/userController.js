const User=require("../models/UserModel");
const bcrypt=require("bcrypt");

const nodemailer=require('nodemailer');
const randomstring=require("randomstring");
const config=require("../config/config");

const adminController=require('../controllers/adminController');

const sendResetPassword=async(name,email,token)=>{
      try{
           const transport= nodemailer.createTransport({
                service: 'gmail',
                host: "smtp.gmail.com",
                port: 465,
                secure:true,
                requireTLS:true,
                auth:{
                    user:config.emailUser,
                    pass:config.emailPassword
                }
            });
            const mailOptions={
                from:config.emailUser,
                to:email,
                subject:'Reset-Password',
                html:'<p>hii '+name+',please click here to <a href="http://127.0.0.1:3000/reset-password?token='+token+'">Reset</a> your password</p>'
            }
            transport.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }
                else{
                    console.log("Email has been sent",info.response);
                }
            });
      }catch(error){
        console.log(error.message);
      }
    }
const loadlogin=async(req,res)=>{
    try{
        res.render('login');
    }catch(error){
        console.log(error.message);
    }
}

const verifyLogin=async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;

       const userdata=await User.findOne({email:email});
        if(userdata){
         const passwordMatch=await bcrypt.compare(password,userdata.password);

         if(passwordMatch){
            req.session.user_id=userdata._id;
            req.session.is_admin=userdata.is_admin;

           if(userdata.is_admin==1){
            res.redirect('/dashboard')
           }
           else{
            res.redirect('/profile');
           }
         }
         else{
            res.render('login',{message:"Email and Password is incorrect"});
         }
        }
        else{
            res.render('login',{message:"Email and Password is incorrect"});
        }
   
    }catch(error){
        console.log(error.message);      
    }
}
const profile =async(req,res)=>{
    try{
        res.send("Hi profile here ");
    }catch(error){
        console.log(error.message);
    }
}

const logout=async(req,res)=>{
    try{
       req.session.destroy(); 
       res.redirect("/login");
    }catch(error){
      console.log(error.message);
    }
}
const forgetload=async(req,res)=>{
    try{
        res.render('forget-password');
    }catch(error){
        console.log(error.message);
    }
}
const forgetPasswordVerify=async(req,res)=>{
    try{
            const email=req.body.email;
            const userData=await User.findOne({email:email});
            if(userData){
                const randomString=randomstring.generate();
                await User.updateOne({email:email},{$set:{token:randomString}});
                sendResetPassword(userData.name,userData.email,randomString);
                res.render('forget-password',{message:"please cheak your mail to reset your password"})
            }else{
                res.render('forget-password',{message:"user email is incorrect"});
            }
    }catch(error){
        console.log(error.message);
    }
}
const resetpasswordload=async(req,res)=>{
    try{
        const token=req.query.token;
       const tokenData= User.findOne({token:token});
        if(tokenData){
            res.render('reset-password',{user_id:tokenData._id});       
         }
        else{
            res.render('404');
        }
    }catch(error){
        console.log(error.message);
    }
}
const resetpassword=async(req,res)=>{
    try{
        const password=req.body.password;
        const user_id=req.body.user_id;
       const securePassword= await adminController.securePassword(password);
       await User.findByIdAndUpdate({_id:user_id},{$set:{password:securePassword,token:''}});

       res.redirect('/login');

    }catch(error){
        console.log(error.messsage);
    }
}
module.exports={
    loadlogin,
    verifyLogin,
    profile,
    logout,
    forgetload,
    forgetPasswordVerify,
    sendResetPassword,
    resetpasswordload,
    resetpassword
}