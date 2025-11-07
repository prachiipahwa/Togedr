// src/pages/GroupChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const GroupChatPage = () => { // <-- Component name changed
  const { id: activityId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  if (!socketRef.current) {
    socketRef.current = io('http://localhost:5000');
  }

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = socketRef.current;

    const setupChat = async () => {
      try {
        const activityRes = await api.get(`/activities/${activityId}`);
        setActivity(activityRes.data);
        const roomId = activityRes.data.chatRoomID;

        if (!roomId) {
          console.error("This activity does not have a chat room.");
          setLoading(false);
          return;
        }

        const messagesRes = await api.get(`/chats/${roomId}/messages`);
        setMessages(messagesRes.data);
        
        socket.emit('joinRoom', roomId);
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
    };
  }, [activityId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socketRef.current && activity) {
      const messageData = {
        roomId: activity.chatRoomID,
        message: newMessage,
        token: user.token,
      };
      socketRef.current.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  if (loading) return <div className="text-center p-8">Loading Chat...</div>;

  return (
    <div className="container mx-auto max-w-2xl h-[calc(100vh-68px)] flex flex-col p-4">
      <div className="mb-4">
        <Link to={`/activity/${activityId}`} className="text-blue-500 hover:underline">&larr; Back to Activity</Link>
        <h1 className="text-2xl font-bold text-gray-800">Chat for: {activity?.title || 'Activity'}</h1>
      </div>

      <div className="flex-grow bg-gray-100 p-4 rounded-lg overflow-y-auto border">
        {messages.map((msg, index) => (
          <div key={index} className={`flex mb-4 ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-sm ${msg.sender._id === user._id ? 'bg-blue-600 text-white' : 'bg-white'}`}>
              {msg.sender._id !== user._id && (
                <p className="text-xs font-bold text-blue-700 mb-1">{msg.sender.name}</p>
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
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-r-lg hover:bg-blue-700">Send</button>
      </form>
    </div>
  );
};

export default GroupChatPage; // <-- Export name changed