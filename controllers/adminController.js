const BlogSetting=require("../models/blogSettingModel");
const User=require("../models/UserModel");
const Post=require("../models/postModel");
const bcrypt=require("bcrypt");
const { post } = require("../routes/adminRoute");

const securePassword=async(password)=>{
 try{
    const passwordHash=await bcrypt.hash(password,10);
    return passwordHash;
 }catch(error){
    console.log(error.message);
 }
}


const blogTwo=async(req,res)=>{
    res.send('Blog2')
}

const blogSetup=async(req,res)=>{
    try{
    var blogSetiing= await BlogSetting.find({});

    if(blogSetiing.length>0){
    res.redirect('/login');
 }
 else{
    res.render('blogsetup');
 }
    }catch(error){
        console.log(error.message);
    }
}
const blogSetupSave=async(req,res)=> {
    try{
                const blog_title=req.body.blog_title;
                const  blog_image=req.file.filename;
               const description= req.body.description;
               const name=req.body.name
                const email=req.body.email;
                const password=await securePassword(req.body.password);
                const blogSetting=new BlogSetting({
                        blog_title:blog_title,
                        blog_logo:blog_image,
                        description:description
                })
                await blogSetting.save();

                const user=new User({
                    name:name,
                    email:email,
                    password:password,
                    is_admin:1


                })
                const userdata=await user.save();
                if(userdata){
                    res.redirect('/login');
                }
                else{
                    res.render('blogsetup',{message:"blog setup not properly"});
                }
    }catch(error)
    {
        console.log(error.message);
    }
}
const dashboard=async(req,res)=>{
    try{
       const allposts=await Post.find({})
        res.render("admin/dashboard",{posts:allposts});
    }catch(error){
        console.log(error.message);
    }

}
const loadPostDashboard=async(req,res)=>{
    try{
       res.render("admin/postDashboard");
    }catch(error){
        console.log(error.message);
    }
}
const addpost=async(req,res)=>{
    try{
        var image='';
        if(req.body.image!==undefined){
            image=req.body.image;
        }
        const post =new Post({
            title:req.body.title,
            content:req.body.content,
            image:image

});
const postData=await post.save();
//res.render("admin/postDashboard",{message:"post added sucessfully"});
res.send({success:true,msg:'Post added sucessfully',_id:postData._id });
    }catch(error){
        res.send({success:false,msg:error.message});
    }
}
const uploadPostImage=async(req,res)=>{
    try{
        var imagePath='/images';
        imagePath=imagePath+'/'+req.file.filename;
        
        res.send({success:true,msg:'Post image upload successfullly',path:imagePath});

    }catch(error){
       res.send({success:false,msg:error.message});
    }
}

const deltePost=async(req,res)=>{
            try{
                await Post.deleteOne({_id:req.body.id});
            }catch(error){
                res.status(400).send({success:false,msg:'Post delted sucessfully'});
            }
}
const loadEditPost=async(req,res)=>{
    try{
      var postData= await Post.findOne({_id:req.params.id});
      res.render("admin/editPost",{post:postData});
    }catch(error){
        console.log(error.message);
    }
}

const updatePost=async(req,res)=>{
    try{
       await Post.findByIdAndUpdate({_id:req.body.id},{
        $set:{
            title:req.body.title,
            content:req.body.content,
            image:req.body.image
           }
       });
       
        res.status(200).send({success:true,msg:'Post updated successfullly!'});
    }catch(error){
        res.status(400).send({success:false,msg:error.message});
    }
}


module.exports={
    blogTwo,
    blogSetup,
    blogSetupSave,
    dashboard,
    loadPostDashboard,
    addpost,
    securePassword,
    uploadPostImage,
    deltePost,
    loadEditPost,
    updatePost,
  
}