import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBot.css"; // Add CSS for better styling
import ShowInChatBox from "./ShowInChatBox";
const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatContainerRef = useRef(null);

    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage = { text: input, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            setInput("");
            const response = await axios.post("http://localhost:5000/api/chat", { message: input });
            console.log(response.data.response);
            const botMessage = { text: response.data.response, sender: "bot" };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "Failed to fetch response. Try again!", sender: "bot" },
            ]);
        }

        
    };

    return (
        <div className="chat-container">
            <ShowInChatBox messages={messages} />
            <div className="chat-input-container">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBot;
