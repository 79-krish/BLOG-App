const Post=require("../models/postModel");
const { ObjectId }=require("mongodb");
const config=require('../config/config');
const nodemailer=require('nodemailer');

const sendCommentMail=async(name,email,post_id)=>{
    try{
       const transPorter= nodemailer.createTransport({
            host:'smtp.gamil.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        })
        const mailoptions={
            from:'BMS',
            to:email,
            subject:'New Reply',
            html:'<P>'+name+'<a href="http://127.0.0.1:3000/post/"'+post_id+'>Read here your replies</a></P>'
        }
        transPorter.sendMail(mailoptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been send",info.response);
            }
        })
    }catch(error){
        console.log(error.message);
    }
}
const loadBlog=async(req,res)=>{
    try{
        const posts=await Post.find({});
        res.render('blog',{posts:posts});

    }catch(error){
        console.log(error.message);
    }
}
const loadPost=async(req,res)=>{
    try{
   const post=await Post.findOne({"_id":req.params.id});
     res.render("post",{post:post}); 
}catch(error){
        console.log(error.message);
    }
}
const addcomment=async(req,res)=>{
    try{    
        var post_id=req.body.post_id;
        var username=req.body.username;
        var email=req.body.email;
        var comment=req.body.comment;
      
        var comment_id= new ObjectId();

       await Post.findByIdAndUpdate({_id:post_id},{
            $push:{
                "comments":{_id:comment_id,username:username,email:email,comment:comment}
            }
        });
        res.status(200).send({sucess:true,msg:'comment added '})

    }catch(error){
        res.status(200).send({sucess:false,msg:error.message})
    }
}
const doReplay=async(req,res)=>{
    try{
        var reply_id= new ObjectId();
       await Post.updateOne({
             "_id":new ObjectId(req.body.post_id),
             "comments._id":new ObjectId(req.body.comment_id),
        },{
            $push:{
               "comments.$.replies":{_id:reply_id,name:req.body.name,reply:req.body.reply } 
            }
        })
        sendCommentMail(req.body.name,req.body.comment_email,req.body.post_id);

        res.status(200).send({sucess:true,msg:"reply addad!"});

    }catch(error){
        res.status(200).send({sucess:false,msg:error.message})
    }
}
module.exports={
    loadBlog,
    loadPost,
    addcomment,
    doReplay,
    sendCommentMail

}