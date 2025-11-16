import { useState, useEffect, useRef } from "react";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server (replace URL with your server)
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    ws.current.onopen = () => console.log("Connected to WebSocket server");
    ws.current.onclose = () => console.log("Disconnected from WebSocket server");

    return () => ws.current.close();
  }, []);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { user: "You", text: input };
    ws.current.send(JSON.stringify(msg)); // Send to WebSocket server
    setInput(""); // Clear input
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 flex flex-col items-center gap-6">

      <h1 className="text-3xl font-bold mb-2">💬 Chatroom</h1>
      <p className="text-gray-400">Simple chat using WebSocket</p>

      {/* Messages Panel */}
      <div className="w-full max-w-2xl h-[60vh] bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl p-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.user === "You" ? "bg-blue-500/50 self-end" : "bg-gray-700/50 self-start"
            }`}
          >
            <strong className="text-sm text-gray-200">{msg.user}</strong>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="w-full max-w-2xl flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-3 py-2 rounded-xl bg-gray-800/40 placeholder-gray-400 outline-none border border-gray-700 focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 rounded-xl hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
