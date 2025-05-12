import React, { useState, useRef, useEffect } from 'react';
import './MainBot.css';
import ChatBot from './ChatBot.jsx';
import { FaTimes } from 'react-icons/fa';

function MainBot({subject, subTopicName, level }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ 
    width: 350, 
    height: 500,
    left: 'auto', // For left resizing
    right: 20     // Initial right position
  });
  const chatContainerRef = useRef(null);
  const isResizing = useRef(false);
  const resizeDirection = useRef('');
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  const startRight = useRef(0);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const startResize = (direction, e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeDirection.current = direction;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { width: dimensions.width, height: dimensions.height };
    startRight.current = window.innerWidth - (chatContainerRef.current.getBoundingClientRect().right);
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e) => {
    if (!isResizing.current) return;
    
    const { x, y } = startPos.current;
    const { width, height } = startSize.current;
    const deltaX = e.clientX - x;
    const deltaY = e.clientY - y;
    
    let newWidth = width;
    let newHeight = height;
    let newRight = dimensions.right;
    let newLeft = dimensions.left;

    // Right edge resize
    if (resizeDirection.current.includes('right')) {
      newWidth = Math.max(300, width + deltaX);
    }
    
    // Bottom edge resize
    if (resizeDirection.current.includes('bottom')) {
      newHeight = Math.max(200, height + deltaY);
    }
    
    // Left edge resize
    if (resizeDirection.current.includes('left')) {
      const containerRight = window.innerWidth - startRight.current;
      const newContainerRight = containerRight - deltaX;
      newWidth = Math.max(300, width - deltaX);
      newRight = newContainerRight;
    }
    
    // Top-left corner resize
    if (resizeDirection.current === 'top-left') {
      const containerRight = window.innerWidth - startRight.current;
      const newContainerRight = containerRight - deltaX;
      newWidth = Math.max(300, width - deltaX);
      newHeight = Math.max(200, height - deltaY);
      newRight = newContainerRight;
    }
    
    setDimensions({ 
      width: newWidth, 
      height: newHeight,
      right: newRight,
      left: newLeft
    });
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, []);

  return (
    <>
      {!isChatOpen && (
        <div className="chatbot-icon" onClick={toggleChat}>
          <img src="/image/gemini-color.png" alt="" style={{width:"30px", height:"30px"}}/>
        </div>
      )}

      {isChatOpen && (
        <div 
          className="chatbot-container" 
          ref={chatContainerRef}
          style={{ 
            width: `${dimensions.width}px`, 
            height: `${dimensions.height}px`,
            right: dimensions.right === 'auto' ? 'auto' : `${dimensions.right}px`,
            left: dimensions.left === 'auto' ? 'auto' : `${dimensions.left}px`
          }}
        >
          <div className="chatbot-header">
            <span>ChatBot</span>
            <button className="close-btn" onClick={toggleChat}>
              <FaTimes size={20} />
            </button>
          </div>
          
          {/* Resize handles */}
          <div 
            className="resize-handle right" 
            onMouseDown={(e) => startResize('right', e)}
          />
          <div 
            className="resize-handle bottom" 
            onMouseDown={(e) => startResize('bottom', e)}
          />
          <div 
            className="resize-handle bottom-right" 
            onMouseDown={(e) => startResize('bottom-right', e)}
          />
          <div 
            className="resize-handle left" 
            onMouseDown={(e) => startResize('left', e)}
          />
          <div 
            className="resize-handle top-left" 
            onMouseDown={(e) => startResize('top-left', e)}
          />
          
          <ChatBot subject={subject} subTopicName={subTopicName} level={level}/>
        </div>
      )}
    </>
  );
}

export default MainBot;