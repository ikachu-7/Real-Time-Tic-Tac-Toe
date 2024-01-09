const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

let players = [];

io.on("connection", (socket) => {
  console.log(`A socket connected: ${socket.id}`);
  socket.on("join-room", (data) => {
    console.log("Player-Joined");
    socket.join(data.roomName);
    players.push({
      roomName: data.roomName,
      userName: data.userName,
      ...data,
    });
    let pl = players.filter((player) => player.roomName === data.roomName);
    if (pl.length === 2) {
      players = players.filter((player) => player.roomName !== data.roomName);
      io.to(data.roomName).emit("game-start", { pl });
    }
  });
  socket.on("move-player", (data) => {
    io.to(data.roomName).emit("update-move", data);
  });
  socket.on("game-over", (message) => {
    io.to(message.roomName).emit("win-moment", message);
  });
  socket.on("finish", (data) => {
    io.to(data.roomName).emit("finish", data.message);
  });
});

server.listen(4000, () => {
  console.log("Server running at port 4000.");
});
