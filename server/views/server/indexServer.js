import {io} from "../socket.io-client.js"

const enviar = document.getElementById("btnInicio");
const caputa = document.getElementById("btnCaptura");
const localVideo = document.getElementById("localVideo");
const connectionState = document.getElementById("connection_state")

const socket = io();

socket.emit("type","server");

const peerConnection = new RTCPeerConnection({
    iceServers:[
        {urls: "stun:stun.l.google.com:19302"}
    ]
})

peerConnection.onicecandidate = evnt => {
    if(evnt.candidate){
        socket.emit("candidate", evnt.candidate)
    }
}

peerConnection.oniceconnectionstatechange = ()=>{
    connectionState.classList.replace(connectionState.className, "state_"+peerConnection.iceConnectionState)
}

const videoConfig = {
    widrh: { ideal: 640},
    height: { ideal: 480},
    frameRate: {ideal: 24}
}

async function capturarPantalla(){
    let screen = await navigator.mediaDevices.getDisplayMedia({video: videoConfig, audio: false});
    localVideo.srcObject = screen;
    screen.getVideoTracks().forEach( track => {
        peerConnection.addTrack(track, screen)
    })
    return true;
}

async function createOffer(){
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer",offer)
}

socket.on("answer", async answer => {
    await peerConnection.setRemoteDescription(answer)
    console.log("respuesta recibida")
})

socket.on("candidateServer", candidate => {
    peerConnection.addIceCandidate(candidate)
})

caputa.onclick = capturarPantalla;

enviar.onclick = () => {
    createOffer();
}