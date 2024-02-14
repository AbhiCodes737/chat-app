import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: getCurrentTime(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="w-1/2 flex flex-col h-3/4 bg-gray-200 rounded-lg overflow-hidden">
      <div className="chat-header bg-green-600 text-white py-2 px-4">
        <p className="text-lg font-bold">Live Chat - Room ID: {room}</p>
      </div>
      <div className="chat-body flex-1 overflow-y-auto">
        <ScrollToBottom className="p-4">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`flex ${
                username === messageContent.author
                  ? "flex-row-reverse"
                  : "flex-row"
              }`}
            >
              <div className="m-1">
                <div
                  className={`text-lg p-2 rounded-lg ${
                    username === messageContent.author
                      ? "bg-green-400"
                      : "bg-yellow-400"
                  }`}
                >
                  <p>{messageContent.message}</p>
                </div>
                <div
                  className={`gap-1 flex ${
                    username === messageContent.author
                      ? "justify-end"
                      : "justify-start"
                  } text-sm text-gray-500`}
                >
                  <p>{messageContent.author}</p>
                  <p>{messageContent.time}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="flex justify-between bg-gray-300 p-4">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a Message"
          className="border border-gray-400 p-2 rounded focus:outline-none w-5/6"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="ml-2 w-1/6 bg-green-600 text-white p-2 rounded focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
