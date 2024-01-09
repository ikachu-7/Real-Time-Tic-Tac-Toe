import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Join = ({ socket }) => {
  const navigate = useNavigate();
  const [obj, setObj] = useState({
    userName: "",
    roomName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setObj({ ...obj, [e.target.id]: e.target.value });
  };

  const handleJoin = () => {
    setLoading(true);

    socket?.emit("join-room", {
      userName: obj.userName,
      roomName: obj.roomName,
    });
  };

  useEffect(() => {
    const handleGameStart = (data) => {
      setLoading(false);
      navigate(`/play/${obj.roomName}`, { state: { players: data.pl } });
    };

    socket?.on("game-start", handleGameStart);

    return () => {
      socket?.off("game-start", handleGameStart);
    };
  }, [socket, navigate, obj]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#282c34",
  };

  const formContainerStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "300px",
    textAlign: "center",
  };

  const labelStyle = {
    fontSize: "18px",
    marginBottom: "8px",
    color: "#333",
  };

  const inputStyle = {
    padding: "12px",
    fontSize: "16px",
    width: "100%",
    marginBottom: "16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    transition: "border-color 0.3s ease",
  };

  const buttonStyle = {
    padding: "12px 20px",
    fontSize: "18px",
    backgroundColor: "#61dafb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const hoverEffect = {
    ":hover": {
      borderColor: "#61dafb",
    },
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <label htmlFor="userName" style={labelStyle}>
          Enter your name:
        </label>
        <input
          type="text"
          id="userName"
          value={obj.userName}
          onChange={handleChange}
          style={{ ...inputStyle, ...hoverEffect }}
        />
        <label htmlFor="roomName" style={labelStyle}>
          Enter room name:
        </label>
        <input
          type="text"
          id="roomName"
          value={obj.roomName}
          onChange={handleChange}
          style={{ ...inputStyle, ...hoverEffect }}
        />
        <button
          onClick={handleJoin}
          style={{ ...buttonStyle, ...hoverEffect }}
          disabled={loading}
        >
          {loading ? "Finding Player..." : "Play"}
        </button>
      </div>
    </div>
  );
};

export default Join;
