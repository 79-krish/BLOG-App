const  express=require("express");
const  user_Route=express();
const bodyParser=require("body-parser");

user_Route.use(bodyParser.json());
user_Route.use(bodyParser.urlencoded({extended:true}));

const session=require("express-session");
const config=require("../config/config")
user_Route.use(session({secret:config.sessionSecret,
resave:true,
saveUninitialized:true
}));

user_Route.set('view engine','ejs');
user_Route.set('views','./views');


const userController=require("../controllers/userController")
const adminLoginAuth=require("../middlewares/adminLoginAuth");

user_Route.use(express.static('public'));
user_Route.get("/login",adminLoginAuth.isLogout,userController.loadlogin)
user_Route.post("/login",userController.verifyLogin);
user_Route.get("/logout",adminLoginAuth.isLogin,userController.logout)
user_Route.get("/profile",userController.profile);
user_Route.get("/forget-password",adminLoginAuth.isLogout,userController.forgetload);
user_Route.post('/forget-password',userController.forgetPasswordVerify);
user_Route.get('/reset-password',adminLoginAuth.isLogout,userController.resetpasswordload);
user_Route.post('/reset-password',userController.resetpassword)
module.exports=user_Route;