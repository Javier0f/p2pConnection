const {createServer} = require("http");
const {Server} = require("socket.io");
const express = require("express");
const {join} = require("path");

const port = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(join(__dirname,"views")));

app.get("/server",(req,res) => {
    res.sendFile(join(__dirname,"views/server/indexServer.html"))
})
app.get("/cliente",(req,res)=>{
    res.sendFile(join(__dirname,"views/cliente/indexCliente.html"))
})

let serverOffer = null;
const list = {
    server: null,
    client: []
}

io.on("connection", socket =>{
    
    socket.on("type", type => {
        console.log(`se unio un nuevo ${type}: ${socket.id}`)
    })

    socket.on("offer", offer => {
        socket.broadcast.emit("offer", offer)
    })

    socket.on("answer", answer => {
        socket.broadcast.emit("answer", answer)
    })

    socket.on("candidate", candidate => {
        socket.broadcast.emit("candidate",candidate)
    })
})

httpServer.listen(port, () => {
    console.log("servidor iniciado http://localhost:"+port)
})