import io from "socket.io-client";
import { useState } from "react";
import React from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      {!showChat ? (
        <div className="flex flex-col gap-4">
          <h3 className="text-4xl text-center text-white font-bold">Join a Chat</h3>
          <input
            type="text"
            placeholder="Username"
            className="border border-black px-3 py-2 focus:border-aqua focus:outline-none"
            onChange={(event) => {
              setUsername(event.target.value.trim());
            }}
          />
          <input
            type="text"
            placeholder="Room ID"
            className="border border-black px-3 py-2 focus:border-aqua focus:outline-none"
            onChange={(event) => {
              setRoom(event.target.value.trim());
            }}
          />
          <button
            onClick={joinRoom}
            className="bg-green-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-green"
          >
            Join a Room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
