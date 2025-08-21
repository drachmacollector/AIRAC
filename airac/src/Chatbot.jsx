import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm AIRAC, your advanced AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "Thank you for your message. I'm processing your request and will provide you with the most accurate information possible. This is a demo response to showcase the interface.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">
            AIRAC
          </h1>
          <p className="header-subtitle">Advanced Intelligence Response & Analytics Core</p>
        </div>
      </header>

      {/* Chat Container */}
      <div className="chat-container">
        {/* Messages Area */}
        <div className="messages-area">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-row ${message.isUser ? 'user-message' : 'bot-message'}`}
            >
              {!message.isUser && (
                <div className="avatar bot-avatar">
                  <Bot className="avatar-icon" />
                </div>
              )}
              
              <div
                className={`message-bubble ${message.isUser ? 'user-bubble' : 'bot-bubble'}`}
              >
                <p className="message-text">{message.text}</p>
                <p className={`message-timestamp ${message.isUser ? 'user-timestamp' : 'bot-timestamp'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.isUser && (
                <div className="avatar user-avatar">
                  <User className="avatar-icon" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="message-row bot-message">
              <div className="avatar bot-avatar">
                <Bot className="avatar-icon" />
              </div>
              <div className="typing-indicator">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot" style={{ animationDelay: '0.1s' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-container">
          <form onSubmit={handleSendMessage} className="input-form">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message to AIRAC..."
              className="input-field"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="send-button"
            >
              <Send className="send-icon" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>AIRAC v1.0 • Advanced AI Interface • Powered by Next-Gen Technology</p>
      </footer>
    </div>
  );
}

export default Chatbot;