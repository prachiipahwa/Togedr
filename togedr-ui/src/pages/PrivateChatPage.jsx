// src/pages/PrivateChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PrivateChatPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartner, setChatPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId || !user) return;

    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    socket.emit('joinRoom', roomId);

    const setupChat = async () => {
      try {
        const messagesRes = await api.get(`/chats/${roomId}/messages`);
        setMessages(messagesRes.data);
        
        const chatRoomRes = await api.get(`/chats/${roomId}`);
        const partner = chatRoomRes.data.participants.find(p => p._id !== user._id);
        setChatPartner(partner);

      } catch (error) {
        console.error("Failed to load chat", error);
      } finally {
        setLoading(false);
      }
    };

    setupChat();

    const receiveMessageHandler = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on('receiveMessage', receiveMessageHandler);

    return () => {
      socket.off('receiveMessage', receiveMessageHandler);
      socket.disconnect();
    };
  }, [roomId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current && chatPartner) {
      const messageData = {
        roomId,
        message: newMessage,
        token: user.token,
      };
      socketRef.current.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  if (loading) return <div>Loading Chat...</div>;

  return (
    <div className="container mx-auto max-w-2xl h-[calc(100vh-68px)] flex flex-col p-4 animate-fade-in-up">
      <div className="mb-4">
         <Link to="/activities" className="text-primary hover:underline">&larr; Back to Activities</Link>
         <h1 className="text-2xl font-bold font-display mt-2">Chat with {chatPartner?.name}</h1>
      </div>
      
      <div className="flex-grow bg-background p-4 rounded-lg overflow-y-auto border">
        {messages.map((msg, index) => (
          <div key={index} className={`flex mb-4 ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-sm ${msg.sender._id === user._id ? 'bg-blue-600 text-white' : 'bg-surface'}`}>
              {msg.sender._id !== user._id && (
                <p className="text-xs font-bold text-primary mb-1">{msg.sender.name}</p>
              )}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          // --- THIS IS THE FIX ---
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-r-lg hover:bg-primary-dark transition-colors">Send</button>
      </form>
    </div>
  );
};

export default PrivateChatPage;