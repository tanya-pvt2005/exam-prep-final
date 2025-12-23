import { useState, useEffect, useRef } from "react";

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // Connect WebSocket after username is set
  useEffect(() => {
    if (!isUsernameSet) return;

    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onopen = () => console.log("Connected to WebSocket");
    ws.current.onclose = () => console.log("Disconnected");
    ws.current.onerror = (err) => console.log("WS Error:", err);

    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch (error) {
        console.log("Invalid message:", event.data);
      }
    };

    return () => ws.current.close();
  }, [isUsernameSet]);

  // Scroll bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { user: username, text: input };
    ws.current.send(JSON.stringify(msg));
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Username screen
  if (!isUsernameSet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col gap-4">
          <h1 className="text-white  text-xl font-bold">Enter username</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-3 py-2 bg-gray-200 rounded-md outline-none"
            placeholder="Username..."
          />
          <button
            onClick={() => setIsUsernameSet(true)}
            className="px-4 py-2 bg-blue-500 rounded-md text-white"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold mb-2">💬 Chatroom</h1>

      <div className="w-full max-w-2xl h-[60vh] bg-gray-800/40 border border-gray-700 rounded-xl p-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.user === username ? "bg-blue-500/50 self-end" : "bg-gray-700/50 self-start"
            }`}
          >
            <strong className="text-sm text-gray-200">{msg.user}</strong>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full max-w-2xl flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700"
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 rounded-xl">
          Send
        </button>
      </div>
    </div>
  );
}
