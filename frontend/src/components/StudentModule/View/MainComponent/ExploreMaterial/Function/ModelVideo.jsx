import React, { useState } from 'react';
import Modal from 'react-modal';
const VideoItem = ({ item }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [content, setContent] = useState(null);
    const displayTitle = item.title.length > 15 ? item.title.slice(0, 12) + '...' : item.title;

    const openModal = () => {
        const url = item.link;

        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            // Extract YouTube embed URL
            const videoId = url.includes("youtu.be")
                ? url.split("/").pop()
                : new URL(url).searchParams.get("v");
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            setContent(
                <iframe
                    width="560"
                    height="315"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            );
        } else if (/\.(pdf|docx?|xlsx?|pptx?)$/i.test(url)) {
            // Show embedded document
            setContent(
                <iframe
                    src={url}
                    width="100%"
                    height="600px"
                    title="Document Viewer"
                    frameBorder="0"
                ></iframe>
            );
        } else {
            // Show website preview
            setContent(
                <iframe
                    src={url}
                    width="100%"
                    height="600px"
                    title="Website Viewer"
                    frameBorder="0"
                ></iframe>
            );
        }

        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setContent(null);
    };

    return (
        <div>
            <div onClick={openModal}>
                🌐 {displayTitle}
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}
                style={{
                    content: {
                        width: '80%', // Set the width of the modal
                        height: '80%', // Set the height of the modal
                        margin: 'auto', // Center the modal
                        overflow: 'hidden', // Prevent overflow
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Optional: Change overlay color
                    }
                }}
            >
                <h2>{item.title}</h2>
                <button onClick={closeModal}>Close</button>
                <div>{content}</div>
            </Modal>
        </div>
    );
};

export default VideoItem;
