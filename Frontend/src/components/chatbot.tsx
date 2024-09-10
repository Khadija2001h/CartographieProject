import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai'; 
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Message de bienvenue
    setMessages([{ text: 'Salut, je suis votre assistant Charikaty. Comment puis-je vous aider aujourd\'hui?', sender: 'bot' }]);
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Ignorer les messages vides

    // Ajouter le message de l'utilisateur
    setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);

    // Réinitialiser le champ d'entrée immédiatement
    setMessage('');

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error('Erreur réseau');
      }

      const data = await res.json();
      console.log('Réponse de l\'API:', data);

      // Nettoyer le texte pour enlever les balises Markdown
      const cleanText = (text) => {
        // Retirer les balises Markdown
        return text.replace(/(\*\*|\*\*|__|__|~~)/g, '');
      };

      // Ajouter la réponse du bot
      setMessages(prevMessages => [
        ...prevMessages,
        { text: cleanText(data.reply) || 'Pas de réponse du bot.', sender: 'bot' }
      ]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Désolé, une erreur est survenue.', sender: 'bot' }]);
    }
  };

  return (
    <>
      <button onClick={handleOpen} style={{ fontSize: '20px', padding: '15px 30px', backgroundColor: 'white', color: '#2d4059', border: '2px solid #2d4059', borderRadius: '5px', cursor: 'pointer' }}>
        Contactez-nous
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '450px', height: '650px', padding: '20px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          {/* Header avec l'icône de fermeture */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: '5px', fontSize: '20px', textAlign: 'center', flexGrow: 1 }}>Assistant Charikaty</h2>
            <AiOutlineClose onClick={handleClose} style={{ fontSize: '24px', cursor: 'pointer' }} /> {/* Icone de fermeture */}
          </div>

          {/* Zone d'affichage des messages */}
          <div style={{ height: 'calc(100% - 110px)', overflowY: 'scroll', padding: '10px', borderBottom: '1px solid #ddd' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '10px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: msg.sender === 'user' ? '#007cb9' : '#f1f0f0',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  whiteSpace: 'pre-wrap' // Permet de conserver les sauts de ligne et espaces
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Zone d'entrée des messages */}
          <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tapez votre message..."
              style={{ flexGrow: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', marginRight: '10px', width: '90%' }}
            />
            <button onClick={handleSendMessage} style={{ fontSize: '16px', padding: '10px 20px', backgroundColor: '#007cb9', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Envoyer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
