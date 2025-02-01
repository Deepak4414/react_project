import React, { useState } from 'react';
import './MainBot.css';
import ChatBot from './ChatBot.jsx';
import { FaCommentDots, FaTimes } from 'react-icons/fa'; // Import icons from react-icons

function MainBot() {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to manage chat visibility

  // Function to toggle chat visibility
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Chatbot icon to open the chat */}
      {!isChatOpen && (
        <div className="chatbot-icon" onClick={toggleChat}>
          <FaCommentDots size={32} />
        </div>
      )}

      {/* ChatBot component with close button */}
      {isChatOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>ChatBot</span>
            <button className="close-btn" onClick={toggleChat}>
              <FaTimes size={20} />
            </button>
          </div>
          <ChatBot />
        </div>
      )}
    </>
  );
}

export default MainBot;