import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io("http://localhost:3000")
const form = document.getElementById("form")
let name = ''
let room = ''

socket.on('connect',()=>{
    document.getElementById("pid").innerText = `connected, id: ${socket.id}`
    document.getElementById("roomId").innerText = `room id: ${socket.id}`

    name = socket.id
})

socket.on('client-client',(obj)=>{
    writeMessage(`${obj.name}: ${obj.message}`)
})

socket.on("siema",(message)=>{
    writeMessage(message)
})


form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const message = document.getElementById('textInput').value

    if(message==="")return
    writeMessage(`you: ${message}`)
    socket.emit('text-message',{message:message, name:name, room:room})

})


export function writeMessage(message) {
    let place = document.getElementById("display")
    let newDiv = document.createElement("div")
    newDiv.textContent = message
    place.append(newDiv)

}

document.getElementById("roomJoinForm").addEventListener('submit',(e)=>{
    e.preventDefault()
    const roomJoinVal = document.getElementById('joinInput').value

    if(roomJoinVal==='')return
    room = roomJoinVal
    document.getElementById("roomId").innerText = `room id: ${roomJoinVal}`
    socket.emit('join-room',room)

})
