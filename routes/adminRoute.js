const  express=require("express");
const  admin_Route=express();
const bodyParser=require("body-parser");

admin_Route.use(bodyParser.json());
admin_Route.use(bodyParser.urlencoded({extended:true}));


const session=require("express-session");
const config=require("../config/config")
admin_Route.use(session({secret:config.sessionSecret,
resave:true,
saveUninitialized:true
}));


admin_Route.set('view engine','ejs');
admin_Route.set('views','./views');

const multer=require("multer");
const path=require("path");

admin_Route.use(express.static('public'));


const storage=multer.diskStorage({
    destination:function(req,file,cb){
       cb(null,path.join(__dirname,'../public/images'));
    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})

const upload=multer({storage:storage});

const  adminController=require("../controllers/adminController");
const adminLoginAuth=require("../middlewares/adminLoginAuth");

admin_Route.get('/blog',adminController.blogTwo)
admin_Route.get('/blog-setup',adminController.blogSetup)
admin_Route.post('/blog-setup',upload.single('blog_image'),adminController.blogSetupSave)
admin_Route.get('/dashboard',adminLoginAuth.isLogin,adminController.dashboard);
admin_Route.get("/create-post",adminLoginAuth.isLogin,adminController.loadPostDashboard);
admin_Route.post("/create-post",adminLoginAuth.isLogin,adminController.addpost);

admin_Route.post("/upload-post-image",upload.single('image'),adminLoginAuth.isLogin,adminController.uploadPostImage);
admin_Route.post("/delete-post",adminLoginAuth.isLogin,adminController.deltePost)

admin_Route.get("/edit-post/:id",adminLoginAuth.isLogin,adminController.loadEditPost);

admin_Route.post('/update-post',adminLoginAuth.isLogin,adminController.updatePost)
    

module.exports=admin_Route;