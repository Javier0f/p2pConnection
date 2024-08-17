const {createServer} = require("http");
const {Server} = require("socket.io");
const {readFileSync} = require("fs")
const express = require("express");
const {join} = require("path");

const port = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(join(__dirname,"../","cliente")))
app.use(express.static(join(__dirname,"../","host")))

app.get("/cl",(req,res)=>{
    res.sendFile(join(__dirname,"../","cliente/index.html"))
})

app.get("/sr",(req, res) => {
    res.sendFile(join(__dirname,"../","host/index.html"))
})

let user = {}

io.on("connection", socket =>{
    socket.on("type", type => {
        user[socket.id] = type;
    })

    socket.on("offer", offer =>{
        socket.broadcast.emit(offer)
        console.log("se creo una oferta de: ", user[socket.id])
    });
    
    socket.on("answer", answer =>{
        socket.broadcast.emit(answer)
        console.log("se creo una respuesta de: ", user[socket.id])
    });

    socket.on("candidate", candidate =>{
        socket.broadcast.emit(candidate)
        console.log("se envio el candidato de: ", user[socket.id])
    });
})

io.on("themel", themel => themel())

httpServer.listen(port, () => {
    console.log("servidor iniciado http://localhost:"+port)
})