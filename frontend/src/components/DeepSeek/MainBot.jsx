import React, { useState } from 'react';
import './MainBot.css';
import ChatBot from './ChatBot.jsx';
import { FaTimes, FaExpand, FaCompress } from 'react-icons/fa';

function MainBot({ subject, subTopicName, level }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleMaximize = () => setIsMaximized(!isMaximized);

  return (
    <>
      {!isChatOpen && (
        <div className="chatbot-icon" onClick={toggleChat}>
          <img src="/image/gemini-color.png" alt="Open Chat" style={{ width: "30px", height: "30px" }} />
        </div>
      )}

      {isChatOpen && (
        <div className={`chatbot-container ${isMaximized ? 'maximized' : 'minimized'}`}>
          <div className="chatbot-header">
            <span>ChatBot</span>
            <div className="chatbot-actions">
              <button className="toggle-btn" onClick={toggleMaximize}>
                {isMaximized ? <FaCompress size={16} /> : <FaExpand size={16} />}
              </button>
              <button className="close-btn" onClick={toggleChat}>
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          <ChatBot subject={subject} subTopicName={subTopicName} level={level} />
        </div>
      )}
    </>
  );
}

export default MainBot;
