import { io } from "./socket.io-client.js";

const socket = io();

const streamVideo = document.getElementById("streamVideo");
const btnRCV = document.getElementById("btnRCV")

let peerConnection;

function crearConexionPeer(){
    peerConnection = new RTCPeerConnection(config);

    peerConnection.onicecandidate = evnt => {
        if(evnt.candidate){
            socket.emit("candidate", evnt.candidate)
        }
    }

    //recive el track del video enviado
    peerConnection.ontrack = (event) => {
        console.log(event.streams[0])
    }
}

socket.on("candidate", async candidate => {
    try{
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    }catch(err){
        console.error("Error al agreagar candidato ICE", err)
    }
})

socket.on("offer", async offer => {
    console.log(offer)
    crearConexionPeer();
    await peerConnection.setRemoteDescription(new RTCSessionDescription (offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit(answer,answer);
})

console.log("hola", socket)

socket.emit("type","Cliente")