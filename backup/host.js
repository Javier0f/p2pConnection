import { io } from "./socketIoClient.js"

const socket = io();

const localVideo = document.getElementById("localVideo")
const btnInicio = document.getElementById("btnInicio")

let localStram;
let peerConnection;

const config = {
    iceServices: [
        {urls: "stun:stun.l.google.com:19302"},
        {urls: "turn:turn:19001"}
    ]
}

function crearConexionPeer(){
    peerConnection = new RTCPeerConnection(config);

    peerConnection.onicecandidate = evnt => {
        if(evnt.candidate){
            socket.emit("candidate", evnt.candidate)
        }
    }

    //se envia el track del video enviado
    localStram.getTracks().forEach( track => {
        peerConnection.addTrack(track,localStram)
    })
}


/**
 * PARTE 1 
 * Creo que esta parte del codigo es para recibir una oferta de otra conexion
 * se recive la offerta de conexion (offer) y se crear una conexion al rededor
 * de la oferta y despues se envia una respuesta (answer) que contiene la 
 * descripcion de este equipo
 */

// socket.on("offer", async offer => {
//     crearConexionPeer();
//     await peerConnection.setRemoteDescription(new RTCSessionDescription (offer));
//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(answer);
//     socket.emit(answer,answer);
// })

/**
 * PARTE 2
 * aca se recibe la respuesta a la oferta que hicimos, no se usa la funcion
 * crearConexionPeer() ya que ya estaria creada para este punto, solo estamos
 * esperando una respuesta a nuestra oferta
 */

socket.on("answer", async answer => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
})

/**
 * Resumen:
 * supongo que esta dos partes de condigo deben estar en los dos (o varios) puntos donde
 * se quiere crear una conexion, veremos resultados
 */

socket.on("candidate", async candidate => {
    try{
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    }catch(err){
        console.error("Error al agreagar candidato ICE", err)
    }
})

async function call(){
    crearConexionPeer();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer",offer);
}

async function starRecordedScreen(){
    try{
        localStram = await navigator.mediaDevices.getDisplayMedia({video:true})
        localVideo.srcObject = localStram;
    } catch(err) {
        console.log("error al grabar la pantalla",err)
    }
}

btnInicio.onclick = async ()=> {
    await starRecordedScreen()
    call();
}

console.log(socket)

socket.emit("type","Servidor")