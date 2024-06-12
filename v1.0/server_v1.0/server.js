import { Server } from "socket.io";
const port = 3000;
let board = [[]];
const io = new Server(port, {
  cors: {
    origin: ["*"],
  },
});

let lobbies = [];
console.log(`server running on port ${port}`);
console.log(`lobbies: ${lobbies}`);

io.on("connection", (socket) => {
  console.log(`connected ${socket.id}`);
  let lastLobbyName = null;

  socket.on("join-new-lobby", (lobbyName) => {
    let lobbyExists = false;
    lobbies.forEach((lobby) => {
      if (lobby.lobbyName == lobbyName) {
        lobbyExists = true;
        return;
      }
    });
    if (!lobbyExists) {
      let lobbyData = { p1: socket.id, p2: "", lobbyName: lobbyName };
      lobbies.push(lobbyData);
      console.log(lobbies);
      socket.emit(`to-game-room`, socket.id, lobbyData);
      socket.join(lobbyName);
      lastLobbyName = lobbyName;
    } else {
      socket.emit(`error-lobby-exists`, socket.id);
    }
  });

  socket.on("join-existing-lobby", (lobbyName) => {
    let i = 0;
    let foundRoom = false;
    let lobbyData;
    let lobbyFull = false;
    lobbies.forEach((lobby) => {
      if (lobby.lobbyName === lobbyName) {
        if (lobbies[i].p2 != "") {
          socket.emit(`error-lobby-full`, socket.id);
          lobbyFull = true;
          foundRoom = true;
        } else {
          lobbies[i].p2 = socket.id;
          foundRoom = true;
          lobbyData = lobbies[i];
          lastLobbyName = lobbyName;
        }
        return;
      }
      i += 1;
    });
    if (foundRoom && !lobbyFull) {
      console.log(lobbies);
      socket.emit(`to-game-room`, socket.id, lobbyData);
      socket.join(lobbyName);
      io.to(lobbyName).emit("full-room", lobbyData);
    }
    if (!foundRoom) {
      socket.emit(`error-lobby-not-exists`, socket.id);
    }
    foundRoom = false;
  });

  // Przesyłanie aktualnej tablicy do graczy w danym lobby

  socket.on("chessboard", (board) => {
    io.to(lastLobbyName).emit("chessboard-refresh", board);
  });

  // Aktualizowanie informacji kogo aktualnie jest tura

  socket.on("turn-change", (turn) => {
    io.to(lastLobbyName).emit("turn-refresh", turn + 1);
  });
});

//wysylanie emita do konkretniego pokoju socket.to(room).emit("emit-name",obj)
