const   express=require('express')
const  mongoose=require("mongoose") 

mongoose.connect("mongodb://127.0.0.1:27017/BMS")
const app=express();
var http=require('http').createServer(app);

var { Server }=require('socket.io');
var io=new Server(http,{});
const isBlog=require("./middlewares/isBlog");

app.use(isBlog.isBlog);



//for admin Route.
const adminRoute=require('./routes/adminRoute')
app.use("/",adminRoute)

// for use Route
const userRoute=require("./routes/userRoute");
app.use("/",userRoute)

io.on("connection",function(socket){
    console.log("user connected");
    Socket.on("new_post",function(formData){
       console.log(formData);
       Socket.broadcast.emit("new_Post",formData)
    });
})
// for blog route
const blogRoute=require("./routes/blogRoute");
const { Socket } = require('dgram');
app.use("/",blogRoute);
http.listen(3000,function(){
    console.log("server is  running");
})
/*app.listen(3000,function(){
    console.log("server is  running");
})*/