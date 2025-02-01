import React from 'react';
import "./ShowInChatBox.css";

const ShowInChatBox = ({ messages }) => {
    // Function to detect URLs and convert them to clickable links
    const renderMessageText = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <div className="chat-container">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <span className="message-text">{renderMessageText(msg.text)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowInChatBox;