import React, { useEffect, useState } from "react";
import "./Home.css";
import { useLocation, useNavigate } from "react-router-dom";

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const players =
    location.state && location.state.players ? location.state.players : [];
  const [value, setValue] = useState(["", "", "", "", "", "", "", "", ""]);
  const [turn, setTurn] = useState(true);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    socket?.on("update-move", (data) => {
      const { index, symbol } = data;
      const newValue = [...value];
      newValue[index] = symbol;
      setValue(newValue);
      if (winningCond() || drawCondition()) {
        socket?.on("win-moment", (data) => {
          setMsg(data.msg);
        });
      }
      setTurn(!turn);
    });
  }, [socket, value, turn]);
  const draw = (index) => {
    if (value[index] === "") {
      const newValue = [...value];
      newValue[index] = turn ? "X" : "O";
      setValue(newValue);
      socket.emit("move-player", {
        roomName: players[0]?.roomName, // Assuming both players are in the same room
        index,
        symbol: newValue[index],
      });
    }
  };

  const winningCond = () => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        value[a] !== "" &&
        value[b] !== "" &&
        value[c] !== "" &&
        value[a] === value[b] &&
        value[a] === value[c]
      ) {
        const winner = turn ? players[0]?.userName : players[1]?.userName;
        socket.emit("game-over", {
          roomName: players[0]?.roomName,
          message: `${winner} wins!`,
        });
        return true;
      }
    }
    return false;
  };

  const drawCondition = () => {
    if (!value.includes("") && !winningCond()) {
      socket.emit("game-over", {
        roomName: players[0]?.roomName,
        message: "It's a draw!",
      });
      return true;
    }
    return false;
  };

  useEffect(() => {
    socket?.on("win-moment", (data) => {
      setMsg(data.message);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    });
  }, [value, turn]);
  return (
    <>
      <div className="player-names">
        <div className="player">Player 1:{players[0]?.userName}</div>
        <div className="player">Player 2: {players[1]?.userName}</div>
      </div>
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: turn ? "green" : "blue",
          }}
        >
          {turn
            ? `${players[0]?.userName}'s turn.`
            : `${players[1]?.userName}'s turn.`}
        </p>
      </div>
      {msg !== "" && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "red" }}>
            {msg}.<br />
            redirecting to home page...
          </p>
        </div>
      )}
      <div class="container">
        <h1>Tic-Tac-Toe</h1>
        <div class="play-area">
          <div id="block_0" class="block" onClick={() => draw(0, turn)}>
            {value[0]}
          </div>
          <div id="block_1" class="block" onClick={() => draw(1, turn)}>
            {value[1]}
          </div>
          <div id="block_2" class="block" onClick={() => draw(2, turn)}>
            {value[2]}
          </div>
          <div id="block_3" class="block" onClick={() => draw(3, turn)}>
            {value[3]}
          </div>
          <div id="block_4" class="block" onClick={() => draw(4, turn)}>
            {value[4]}
          </div>
          <div id="block_5" class="block" onClick={() => draw(5, turn)}>
            {value[5]}
          </div>
          <div id="block_6" class="block" onClick={() => draw(6, turn)}>
            {value[6]}
          </div>
          <div id="block_7" class="block" onClick={() => draw(7, turn)}>
            {value[7]}
          </div>
          <div id="block_8" class="block" onClick={() => draw(8, turn)}>
            {value[8]}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
