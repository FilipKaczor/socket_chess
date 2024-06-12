import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

// Server connection
const socket = io("/");
let player_id = "";
let player_number = null;

socket.on("connect", () => {
  console.log(socket.id);
  player_id = socket.id;
  document.getElementById("playerId").innerText = `player_id: ${player_id}`;
});

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (document.getElementById("joinRoom").value != "") {
    socket.emit(
      "join-existing-lobby",
      document.getElementById("joinRoom").value
    );
  } else if (document.getElementById("newRoom").value != "") {
    socket.emit("join-new-lobby", document.getElementById("newRoom").value);
  } else {
  }
});

socket.on("to-game-room", (clientId, roomInfo) => {
  if (player_id === clientId) {
    // console.log(`in room: ${roomInfo}`)
    document.getElementById(
      "roomName"
    ).innerText = `room: ${roomInfo.lobbyName}`;
    document.getElementById("newRoom").value = "";
    document.getElementById("joinRoom").value = "";
    document.getElementById("submitRoom").disabled = true;
    document.getElementById("joinRoom").disabled = true;
    document.getElementById("newRoom").disabled = true;
    console.log("Connected");
  }
});

socket.on("full-room", (lobbyData) => {
  player_number = lobbyData.p1 === player_id ? 1 : 2;

  document.getElementsByClassName("main-container")[0].style.display = "none";
  document.getElementById("root").style.display = "block";

  const root = ReactDOM.createRoot(document.getElementById("root"));
  console.log(player_number);
  root.render(
    <React.StrictMode>
      <App player_number={player_number} />
    </React.StrictMode>
  );
});

socket.on("error-lobby-exists", (clientId) => {
  if (player_id === clientId) {
    alert("lobby exists, try different lobby name");
    document.getElementById("newRoom").value = "";
  }
});

socket.on("error-lobby-not-exists", (clientId) => {
  if (player_id === clientId) {
    alert("lobby does not exist, try different lobby name");
    document.getElementById("joinRoom").value = "";
  }
});

socket.on("error-lobby-full", (clientId) => {
  if (player_id === clientId) {
    alert("lobby is full, try different lobby");
    document.getElementById("joinRoom").value = "";
  }
});

// const root = ReactDOM.createRoot(document.getElementById("root"));
// console.log(player_number);
// root.render(
//   <React.StrictMode>
//     <App player_number={2} />
//   </React.StrictMode>
// );

export default socket;
