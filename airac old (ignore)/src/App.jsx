import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function ParticleBackground() {
  useEffect(() => {
    const container = document.querySelector('.particles');
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 3 + 1;
      
      // Random delay
      const delay = Math.random() * 8;
      
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
      
      // Remove particle after animation completes
      setTimeout(() => {
        particle.remove();
      }, 8000);
    };
    
    // Create initial particles
    for (let i = 0; i < 100; i++) {
      createParticle();
    }
    
    // Create new particles periodically
    const interval = setInterval(() => {
      createParticle();
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  return <div className="particles"></div>;
}

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
            <filter id="user-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>
          <circle cx="32" cy="32" r="30" fill="url(#g1)" filter="url(#user-glow)" />
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
            <filter id="bot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>
          <circle cx="32" cy="32" r="30" fill="url(#g2)" filter="url(#bot-glow)" />
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
    { 
      role: "bot", 
      text: "AIRAC online. Ask me anything about the archive.", 
      time: Date.now(),
      id: Date.now()
    },
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

  async function getBotResponse(userMessage) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          "I've analyzed your query and found relevant data in the archive.",
          "Based on my records, here's what I can share...",
          "The archive contains several relevant entries on that topic.",
          "My analysis suggests multiple approaches to your question.",
          "I've cross-referenced your query with our knowledge base.",
          "The historical records show an interesting pattern here."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        resolve({ response: `${randomResponse} This is a simulated response to: "${userMessage}"` });
      }, 900);
    });
  }

  const sendMessage = async () => {
    setErrorMsg("");
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { 
      role: "user", 
      text: trimmed, 
      time: Date.now(),
      id: Date.now()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const json = await getBotResponse(trimmed);
      const botText = (json && (json.response || json.text || json.output)) ?? "No response";
      const botMsg = { 
        role: "bot", 
        text: botText, 
        time: Date.now(),
        id: Date.now()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setErrorMsg("Could not reach AIRAC. Try again later.");
      const errMsg = { 
        role: "bot", 
        text: "⚠️ Error: failed to fetch response.", 
        time: Date.now(),
        id: Date.now()
      };
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
      <ParticleBackground />
      
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
        <div className="hologram-overlay"></div>
        
        <header className="chat-header">
          <div className="title">
            <div className="logo-hex" aria-hidden>
              <svg viewBox="0 0 100 100" width="36" height="36">
                <defs>
                  <linearGradient id="hex-grad" x1="0" x2="1">
                    <stop offset="0" stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <polygon points="50,6 86,25 86,69 50,88 14,69 14,25" fill="url(#hex-grad)" opacity="0.95" />
                <circle cx="50" cy="50" r="10" fill="#06113c" opacity="0.9" />
              </svg>
            </div>
            <div>
              <div className="title-main">AIRAC</div>
            </div>
          </div>
        </header>

        <section className="chat-window" role="log" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`msg-row ${m.role === "user" ? "row-user" : "row-bot"} appear`}>
              <Avatar role={m.role === "user" ? "user" : "bot"} />
              <div className={`bubble ${m.role}`}>
                <div className="bubble-text">{m.text}</div>
                <div className="meta">
                  <span className="time">{fmt(m.time)}</span>
                  <span>{m.role === "bot" ? "AIRAC" : "You"}</span>
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
                <div className="bubble-text">AIRAC is analyzing<span className="typing-cursor"></span></div>
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
            placeholder="Type your query... (Enter to send)"
            aria-label="Chat message"
          />

          <div className="actions">
            <button className="btn primary" onClick={sendMessage} disabled={loading}>
              {loading ? "Processing..." : "Send"}
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