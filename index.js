const   express=require('express')
const  mongoose=require("mongoose") 

mongoose.connect("mongodb://127.0.0.1:27017/BMS")
const   app=express();
const isBlog=require("./middlewares/isBlog");

app.use(isBlog.isBlog);



//for admin Route.
const adminRoute=require('./routes/adminRoute')
app.use("/",adminRoute)

// for use Route
const userRoute=require("./routes/userRoute");
app.use("/",userRoute)

// for blog route
const blogRoute=require("./routes/blogRoute");
app.use("/",blogRoute);
app.listen(3000,function(){
    console.log("server is  running");
})