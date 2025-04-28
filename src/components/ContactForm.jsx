// src/components/ContactForm.js
import React, { useState } from 'react';
import './ContactForm.css';

const ContactForm = ({ onSend }) => {
  const [message, setMessage] = useState('');

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message..."
        required
      />
      <button className="send-button" type="submit">Send</button>
    </form>
  );
};

export default ContactForm;
