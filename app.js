const express=require("express")
const socket=require("socket.io")
const http=require("http")
const {Chess}=require ("chess.js")
const path= require ('path')

const app=express();
const server=http.createServer(app);

const io=socket(server);

const chess=new Chess();
const port=3000;
let players={};
let currentPlayer ="W";

app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
    res.render("index")
})

io.on("connection",function(uniquesocket){
    console.log("connected");  
    uniquesocket.on("disconnect",function(){
        console.log("disconnect")
    }) 
})



server.listen(port,()=>{
    console.log(`listening on port ${port}`)
});