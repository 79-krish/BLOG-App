const BlogSetting=require("../models/blogSettingModel");
const User=require("../models/UserModel");
const Post=require("../models/postModel");
const bcrypt=require("bcrypt");

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
        res.render("admin/dashboard");
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
        const post =new Post({
    title:req.body.title,
    content:req.body.content,

});
const postData=await post.save();
res.render("admin/postDashboard",{message:"post added sucessfully"});
    }catch(error){
        console.log(error.message);
    }
}


module.exports={
    blogTwo,
    blogSetup,
    blogSetupSave,
    dashboard,
    loadPostDashboard,
    addpost,
    securePassword
}