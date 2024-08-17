import {io} from "../socket.io-client.js"

const socket = io();

const mensajeContent = document.getElementById("mensaje");

socket.emit("type","client");

const peerConnection = new RTCPeerConnection({
    iceServers:[
        {urls:"stun:stun.1.google.com:19302"}
    ]
})

peerConnection.onicecandidate = evnt => {
    if(evnt.candidate){
        socket.emit("candidate", evnt.candidate)
    }
}

peerConnection.ontrack = evnt => {
    let videoStream = document.getElementById("streamVideo")
    videoStream.srcObject = evnt.streams[0];
}

socket.on("offer", async offer => {
    await peerConnection.setRemoteDescription(offer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answer", answer);
    console.log("respuesta envida")
})

socket.on("candidate", candidate => {
    peerConnection.addIceCandidate(candidate)
})

socket.on("mensaje", mensaje => {
    let p = document.createElement("p")
    p.innerText = mensaje;
    mensajeContent.appendChild(p);
} )