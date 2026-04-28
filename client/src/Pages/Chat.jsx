import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const Chat = ({ user }) => {
  const { requestId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null); // 👈 NEW

  useEffect(() => {
    const loadMessages = () => {
      fetch(`http://localhost:5001/messages/${requestId}`)
        .then((res) => res.json())
        .then((data) => setMessages(data));
    };

    loadMessages();

    const interval = setInterval(loadMessages, 2000);

    return () => clearInterval(interval);
  }, [requestId]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      requestId,
      text: message,
      sender: user.displayName,
      senderEmail: user.email,
      time: new Date().toLocaleTimeString(),
      createdAt: new Date(),
    };

    fetch("http://localhost:5001/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          setMessages((prev) => [
            ...prev,
            { _id: data.insertedId, ...newMessage },
          ]);
          setMessage("");
        }
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 text-white px-5 py-4">
          <h1 className="text-xl font-bold">Private Chat</h1>
          <p className="text-sm text-blue-100">Accepted trip conversation</p>
        </div>

        {/* Messages */}
        <div className="h-[60vh] overflow-y-auto p-5 space-y-3 bg-slate-50">
          {messages.length === 0 ? (
            <p className="text-center text-slate-500 mt-10">
              No messages yet
            </p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderEmail === user.email;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-slate-800 border rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-[11px] mt-1 ${
                        isMe ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {msg.sender} • {msg.time}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* 👇 AUTO SCROLL TARGET */}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;