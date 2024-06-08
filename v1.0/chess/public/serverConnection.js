import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

    const socket = io("/")
    let name = ''

    socket.on('connect', () => {
        console.log(socket.id)
        name = socket.id
        document.getElementById("playerId").innerText = `player_id: ${name}`

    })

    document.getElementById("form").addEventListener('submit', (e) => {
        e.preventDefault()
        if (document.getElementById("joinRoom").value != "") {
            socket.emit('join-existing-lobby', document.getElementById("joinRoom").value)
        }
        else if (document.getElementById("newRoom").value != "") {
            socket.emit('join-new-lobby', document.getElementById("newRoom").value)
        }
        else {

        }

    })

    socket.on('to-game-room', (clientId, roomInfo) => {
        if (name === clientId) {
            // console.log(`in room: ${roomInfo}`)
            document.getElementById("roomName").innerText = `room: ${roomInfo.lobbyName}`
            document.getElementById("newRoom").value = ''
            document.getElementById("joinRoom").value = ''
            document.getElementById("submitRoom").disabled = true
            document.getElementById("joinRoom").disabled = true
            document.getElementById("newRoom").disabled = true
        }
    })

    socket.on('error-lobby-exists', (clientId) => {
        if (name === clientId) {
            alert('lobby exists, try different lobby name')
            document.getElementById("newRoom").value = ''
        }
    })

    socket.on('error-lobby-not-exists', (clientId) => {
        if (name === clientId) {
            alert('lobby does not exist, try different lobby name')
            document.getElementById("joinRoom").value = ''
        }
    })

    socket.on('error-lobby-full', (clientId) => {
        if (name === clientId) {
            alert('lobby is full, try different lobby')
            document.getElementById("joinRoom").value = ''
        }
    })