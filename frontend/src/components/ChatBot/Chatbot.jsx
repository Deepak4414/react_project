import React, { useState } from 'react';
import './Chatbot.css';
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button className="chat-btn" onClick={handleOpenChat}>
        <img src="/image/ai-logo.png" alt="" style={{width: 30, height: 30}}/>
      </button>
      {isOpen && (
        <div className="chat-box">
          <iframe
            src="https://copilotstudio.microsoft.com/environments/Default-3b0993d8-31db-4db6-b617-64ac193c7ace/bots/crb47_agentFghfw8/webchat?__version__=2"
            frameborder="0"
            style={{ width: '100%', height: '100%' }}
          />
          <div className="chat-box-footer">
            <input type="text" placeholder="Type a message..." />
            <button type="submit">Send</button>
            <button className="close-btn" onClick={handleCloseChat}>
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;