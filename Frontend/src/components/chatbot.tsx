"use client";

import React, { useState, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Initialize with a greeting message
    setMessages([{ text: 'Salut, je suis votre assistant Charikaty. Comment puis-je vous aider aujourd\'hui?', sender: 'bot' }]);
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Ignore empty messages

    // Add user message
    setMessages([...messages, { text: message, sender: 'user' }]);

    try {
      const res = await fetch('/api/chatbot', { // Ensure correct API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle streaming response
      const reader = res.body?.getReader();
      if (reader) {
        let decodedText = '';
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          decodedText += decoder.decode(value, { stream: true });
          setMessages([...messages, { text: message, sender: 'user' }, { text: decodedText, sender: 'bot' }]);
        }
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
    }
  };

  return (
    <>
      <button onClick={handleOpen} style={{ fontSize: '20px', padding: '15px 30px', backgroundColor: 'white', color: '#2d4059', border: '2px solid #2d4059', borderRadius: '5px', cursor: 'pointer' }}>
        Contact us
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '300px', height: '400px', padding: '10px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <h2 style={{ margin: '0', fontSize: '18px' }}>Chatbot</h2>
          <div style={{ height: 'calc(100% - 90px)', overflowY: 'scroll', padding: '10px', borderBottom: '1px solid #ddd' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '10px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                <div style={{ display: 'inline-block', padding: '10px', borderRadius: '10px', backgroundColor: msg.sender === 'user' ? '#007cb9' : '#f1f0f0', color: msg.sender === 'user' ? 'white' : 'black' }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{ flexGrow: 1, marginRight: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button onClick={handleSendMessage} style={{ fontSize: '16px', padding: '10px 20px', backgroundColor: '#007cb9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Send
            </button>
            <button onClick={handleClose} style={{ fontSize: '16px', padding: '10px 20px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
