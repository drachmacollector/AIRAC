import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 The only place to change later when backend is ready
  async function getBotResponse(userMessage) {
    // Temporary mock
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ response: `Mock reply to: "${userMessage}"` });
      }, 1000);
    });

    // Later replace with:
    /*
    const res = await fetch("https://their-api.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userMessage })
    });
    return await res.json();
    */
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Get bot reply
    const botData = await getBotResponse(userMsg.text);
    const botMsg = { role: "bot", text: botData.response };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="message bot loading">...</div>}
      </div>

      <div className="input-bar">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
