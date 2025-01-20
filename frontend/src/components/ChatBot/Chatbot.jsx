import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.post("http://localhost:5000/api/chat", {
                message: input,
            });

            const botMessage = { sender: "bot", text: response.data.reply };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            const errorMessage = { sender: "bot", text: "Error connecting to the chatbot API." };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        setInput("");
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <div
                style={{
                    height: "400px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    overflowY: "scroll",
                    marginBottom: "10px",
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            textAlign: msg.sender === "user" ? "right" : "left",
                            margin: "5px 0",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                padding: "10px",
                                borderRadius: "10px",
                                backgroundColor: msg.sender === "user" ? "#daf8cb" : "#f1f0f0",
                            }}
                        >
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                style={{ width: "80%", padding: "10px", marginRight: "10px" }}
            />
            <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
                Send
            </button>
        </div>
    );
};

export default Chatbot;
