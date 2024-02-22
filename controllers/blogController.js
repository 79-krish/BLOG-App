const Post=require("../models/postModel");
const { ObjectId }=require("mongodb");

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

}