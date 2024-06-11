// const express=require("express")
// const socket=require("socket.io")
// const http=require("http")
// const {Chess}=require ("chess.js")
// const path= require ('path')

// const app=express();
// const server=http.createServer(app);

// const io=socket(server);

// const chess=new Chess();
// const port=3000;
// let players={};
// let currentPlayer ="W";

// app.set("view engine","ejs")
// app.use(express.static(path.join(__dirname,"public")));

// app.get('/',(req,res)=>{
//     res.render("index")
// })

// io.on("connection",function(uniquesocket){
//         console.log("connected"); 
//         if(!players.white)
//             {
//                 players.white=uniquesocket.id;
//                 uniquesocket.emit("playerRole","w")
//             }
//         else if(!players.black){
//               players.black=uniquesocket.id;
//               uniquesocket.emit("playerRole","b")
//         }
//         else{
//             uniquesocket.emit("spectatorRole")
//         }


//         uniquesocket.on("disconnect",function(){
//             if(uniquesocket.id===players.white)
//                 {
//                     delete players.white;
//                 }
//              else if(uniquesocket.id ===players.black)
//                 {
//                      delete players.black;
//                 }
//         });

//         uniquesocket.on("move",(currmove)=>{
//            try{
//               if(chess.turn()==='w' && uniquesocket.id!==players.white)return;
//               if(chess.turn()==='b' && uniquesocket.id!==players.black)return;

//              const result= chess.move(currmove)
//              if(result)
//                 {
//                     currentPlayer=chess.turn();
//                     io.emit("move",currmove)  
//                     io.emit("boardState",chess.fen())
//                 }
//                 else{
//                     console.log('Invalid Move:',currmove)
//                     uniquesocket.emit("invalidMove",currmove);
//                 }
              
//            }
//            catch(err){
//                console.log(err);
//                uniquesocket.emit("Invalid move:",move);
//            }
//         })
// })



// server.listen(port,()=>{
//     console.log(`listening on port ${port}`)
// });


const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socket(server);

const chess = new Chess();
const port = 3000;
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render("index");
});

io.on("connection", (uniquesocket) => {
    console.log("connected");
    if (!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } else {
        uniquesocket.emit("spectatorRole");
    }

    uniquesocket.emit("boardState", chess.fen());

    uniquesocket.on("disconnect", function () {
        if (uniquesocket.id === players.white) {
            delete players.white;
        } else if (uniquesocket.id === players.black) {
            delete players.black;
        }
    });

    uniquesocket.on("move", (currmove) => {
        try {
            if (chess.turn() === 'w' && uniquesocket.id !== players.white) return;
            if (chess.turn() === 'b' && uniquesocket.id !== players.black) return;

            const result = chess.move(currmove);
            if (result) {
                currentPlayer = chess.turn();
                io.emit("move", currmove);
                io.emit("boardState", chess.fen());
            } else {
                console.log('Invalid Move:', currmove);
                uniquesocket.emit("invalidMove", currmove);
            }
        } catch (err) {
            console.log(err);
            uniquesocket.emit("Invalid move:", currmove);
        }
    });
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
