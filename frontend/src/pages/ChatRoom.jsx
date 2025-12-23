// import { useState, useEffect, useRef } from "react";

// export default function ChatRoom() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [username, setUsername] = useState("");
//   const [isUsernameSet, setIsUsernameSet] = useState(false);
//   const ws = useRef(null);
//   const messagesEndRef = useRef(null);

//   // Connect WebSocket after username is set
//   useEffect(() => {
//     if (!isUsernameSet) return;

//     ws.current = new WebSocket("ws://localhost:5000");

//     ws.current.onopen = () => console.log("Connected to WebSocket");
//     ws.current.onclose = () => console.log("Disconnected");
//     ws.current.onerror = (err) => console.log("WS Error:", err);

//     ws.current.onmessage = (event) => {
//       try {
//         const msg = JSON.parse(event.data);
//         setMessages((prev) => [...prev, msg]);
//       } catch (error) {
//         console.log("Invalid message:", event.data);
//       }
//     };

//     return () => ws.current.close();
//   }, [isUsernameSet]);

//   // Scroll bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const msg = { user: username, text: input };
//     ws.current.send(JSON.stringify(msg));
//     setInput("");
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   // Username screen
//   if (!isUsernameSet) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900">
//         <div className="bg-gray-800 p-6 rounded-lg flex flex-col gap-4">
//           <h1 className="text-white text-xl font-bold">Enter username</h1>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="px-3 py-2 rounded-md outline-none"
//             placeholder="Username..."
//           />
//           <button
//             onClick={() => setIsUsernameSet(true)}
//             className="px-4 py-2 bg-blue-500 rounded-md text-white"
//           >
//             Join Chat
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white px-4 py-6 flex flex-col items-center gap-6">
//       <h1 className="text-3xl font-bold mb-2">💬 Chatroom</h1>

//       <div className="w-full max-w-2xl h-[60vh] bg-gray-800/40 border border-gray-700 rounded-xl p-4 overflow-y-auto flex flex-col gap-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded-lg max-w-[70%] ${
//               msg.user === username ? "bg-blue-500/50 self-end" : "bg-gray-700/50 self-start"
//             }`}
//           >
//             <strong className="text-sm text-gray-200">{msg.user}</strong>
//             <p>{msg.text}</p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="w-full max-w-2xl flex gap-2">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700"
//         />
//         <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 rounded-xl">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";

export default function ChatRoom() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(""); // 'user' or 'admin'
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(""); // admin replies
  const [usersList, setUsersList] = useState([]); // admin dropdown
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const userId = useRef(Date.now().toString()); // unique user ID

  // Connect WebSocket after join
  useEffect(() => {
    if (!isJoined) return;

    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onopen = () => {
      ws.current.send(
        JSON.stringify({ type: "register", role, username, userId: userId.current })
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // User receives admin reply
      if (role === "user" && data.type === "admin-reply") {
        setMessages(prev => [...prev, { user: data.from, text: data.message }]);
      }

      // Admin receives user messages
      if (role === "admin") {
        if (data.type === "user-message") {
          setMessages(prev => [...prev, { user: data.username, text: data.message, userId: data.userId }]);
        }
        if (data.type === "user-list") {
          setUsersList(data.users);
        }
      }
    };

    ws.current.onclose = () => console.log("WebSocket disconnected");
    ws.current.onerror = (err) => console.log("WS Error:", err);

    return () => ws.current.close();
  }, [isJoined, role, username]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    if (role === "user") {
      ws.current.send(JSON.stringify({
        type: "user-message",
        message: input,
        username,
        userId: userId.current
      }));
      setMessages(prev => [...prev, { user: "You", text: input }]);
    } else if (role === "admin") {
      if (!selectedUser) return alert("Select a user to reply!");
      ws.current.send(JSON.stringify({
        type: "admin-reply",
        message: input,
        toUserId: selectedUser
      }));
      setMessages(prev => [...prev, { user: "You", text: input, to: selectedUser }]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Join screen
  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col gap-4">
          <h1 className="text-white text-xl font-bold">Enter username</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username..."
            className="px-3 py-2 rounded-md outline-none"
          />
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setRole("user")}
              className="px-4 py-2 bg-blue-500 rounded-md text-white"
            >
              Join as User
            </button>
            <button
              onClick={() => setRole("admin")}
              className="px-4 py-2 bg-green-500 rounded-md text-white"
            >
              Join as Admin
            </button>
          </div>
          {role && (
            <button
              onClick={() => setIsJoined(true)}
              className="px-4 py-2 bg-yellow-500 rounded-md text-white mt-2"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold mb-2">
        {role === "user" ? "Message Admin " : "User Queries"}
      </h1>

      {/* Admin dropdown */}
      {role === "admin" && (
        <div className="w-full max-w-2xl flex gap-2 mb-2">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700"
          >
            <option value="">Select user to reply</option>
            {usersList.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Messages area */}
      <div className="w-full max-w-2xl h-[60vh] bg-gray-800/40 border border-gray-700 rounded-xl p-4 overflow-y-auto flex flex-col gap-2">
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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
