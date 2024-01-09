import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Join socket={socket} />} />
      <Route path="/play/:room" element={<Home socket={socket} />} />
    </Routes>
  );
};

export default App;
