import React, { useEffect, useRef, useState } from "react";
import "./App.css";

/*
  Sci-fi Chat Frontend (vanilla CSS)
  - Replace getBotResponse() mock with real fetch() when backend is ready.
  - Expected request format (per your earlier message): { "query": "<user text>" }
  - Expected response format: { "response": "<bot text>" }
*/

function Avatar({ role }) {
  return (
    <div className={`avatar ${role}`}>
      {role === "user" ? (
        <svg viewBox="0 0 64 64" width="36" height="36" aria-hidden>
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="30" fill="url(#g1)" />
          <circle cx="32" cy="24" r="9" fill="#fff" opacity="0.9" />
          <rect x="14" y="38" width="36" height="12" rx="6" fill="#fff" opacity="0.15" />
        </svg>
      ) : (
        <svg viewBox="0 0 64 64" width="36" height="36" aria-hidden>
          <defs>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0" stopColor="#6b21a8" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="30" fill="url(#g2)" />
          <g fill="#fff" opacity="0.95">
            <path d="M30 20c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z" />
            <path d="M16 44c0-7 12-10 16-10s16 3 16 10v4H16v-4z" opacity="0.12"/>
          </g>
        </svg>
      )}
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "AIRAC online. Ask me anything about the archive.", time: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, loading]);

  // 🔹 Single place to swap in the backend API
  async function getBotResponse(userMessage) {
    // Temporary MOCK (for dev & styling)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ response: `mock reply to: "${userMessage}"` });
      }, 900);
    });


    // -------------------------
    // LATER: Replace above with real fetch:
    // -------------------------
    /*
    try {
      const res = await fetch("https://their-api.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": "Bearer <token-if-needed>"
        },
        body: JSON.stringify({ query: userMessage })
      });

      if (!res.ok) {
        // handle non-2xx responses
        const errText = await res.text();
        throw new Error(`Server ${res.status}: ${errText}`);
      }

      // expected: { "response": "..." }
      const data = await res.json();
      return data;
    } catch (err) {
      // rethrow so caller can show UI error
      throw err;
    }
    */
  }

  // send action
  const sendMessage = async () => {
    setErrorMsg("");
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", text: trimmed, time: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const json = await getBotResponse(trimmed);
      const botText = (json && (json.response || json.text || json.output)) ?? "No response";
      const botMsg = { role: "bot", text: botText, time: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setErrorMsg("Could not reach AIRAC. Try again later.");
      const errMsg = { role: "bot", text: "⚠️ Error: failed to fetch response.", time: Date.now() };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fmt = (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="app-root">
      <svg className="bg-dna" viewBox="0 0 600 600" aria-hidden>
        <defs>
          <linearGradient id="dnaGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#06b6d4" stopOpacity="0.12" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <g transform="translate(20,10)" stroke="url(#dnaGrad)" strokeWidth="1">
          <path d="M0 20 C40 0, 80 40, 120 20 S200 20, 240 40" fill="none"/>
          <path d="M0 40 C40 20, 80 60, 120 40 S200 40, 240 60" fill="none"/>
        </g>
      </svg>

      <main className="chat-shell">
        <header className="chat-header">
          <div className="title">
            <div className="logo-hex" aria-hidden>
              <svg viewBox="0 0 100 100" width="36" height="36">
                <polygon points="50,6 86,25 86,69 50,88 14,69 14,25" fill="#0ea5a6" opacity="0.95" />
                <circle cx="50" cy="50" r="10" fill="#06113c" opacity="0.9" />
              </svg>
            </div>
            <div>
              <div className="title-main">AIRAC</div>
            </div>
          </div>
        </header>

        <section className="chat-window" role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`msg-row ${m.role === "user" ? "row-user" : "row-bot"} appear`}>
              <Avatar role={m.role === "user" ? "user" : "bot"} />
              <div className={`bubble ${m.role}`}>
                <div className="bubble-text">{m.text}</div>
                <div className="meta">
                  <span className="time">{fmt(m.time)}</span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row row-bot appear">
              <Avatar role="bot" />
              <div className="bubble bot typing">
                <div className="dots" aria-hidden>
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
                <div className="bubble-text sr-only">AIRAC is typing...</div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </section>

        <footer className="input-bar">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type something... (Enter to send)"
            aria-label="Chat message"
          />

          <div className="actions">
            <button className="btn primary" onClick={sendMessage} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </footer>

        {errorMsg && <div className="error-line">{errorMsg}</div>}
      </main>

      <svg className="bg-brain" viewBox="0 0 200 200" aria-hidden>
        <defs>
          <linearGradient id="b1" x1="0" x2="1">
            <stop offset="0" stopColor="#7c3aed" stopOpacity="0.08" />
            <stop offset="1" stopColor="#06b6d4" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <g transform="translate(20,20)" fill="url(#b1)">
          <ellipse cx="60" cy="60" rx="50" ry="30" />
          <path d="M15 60 C30 10, 120 10, 145 60 C160 90, 20 110, 15 60z" />
        </g>
      </svg>
    </div>
  );
}
