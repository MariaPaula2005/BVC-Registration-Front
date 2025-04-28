import React, { useEffect, useState } from 'react';
import './AdminForms.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboardPage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/messages/messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Messages from Students</h2>
      <ul className="list-group">
        {messages.map((msg, index) => (
          <li key={index} className="list-group-item">
            <p><strong>From:</strong> {msg.studentName}</p>
            <p><strong>Email:</strong> {msg.studentEmailValue}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p><small><strong>Sent:</strong> {new Date(msg.timestamp).toLocaleString()}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboardPage;
