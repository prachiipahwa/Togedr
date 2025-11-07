const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cloudinary= require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const User = require('./models/User');
const ChatRoom = require('./models/ChatRoom');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activity'); // <-- Add this
const swipeRoutes = require('./routes/swipe');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const tagRoutes = require('./routes/tag'); // <-- Add this
const uploadRoutes = require('./routes/upload'); // <-- Add this
const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity. In production, restrict this to your frontend's URL.
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.get('/', (req, res) => {
  res.send('Togedr Backend API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/swipes', swipeRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes); // <-- Add this
app.use('/api/upload', uploadRoutes); // <-- Add this
// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  // User joins a specific chat room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Listen for a new message from a client
  socket.on('sendMessage', async ({ roomId, message, token }) => {
    try {
      // 1. Authenticate the user from the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return; // Or handle error

      // 2. Create the message object
      const newMessage = {
        sender: user._id,
        text: message,
        timestamp: new Date(),
      };
      
      // 3. Save the message to the database
      const chatRoom = await ChatRoom.findByIdAndUpdate(
        roomId,
        { $push: { messages: newMessage } },
        { new: true }
      );
      
      // 4. Broadcast the new message to all clients in that room
      // We populate the sender's info before sending it back
      const populatedMessage = {
          ...newMessage,
          sender: { _id: user._id, name: user.name, profilePictureUrl: user.profilePictureUrl }
      };
      io.to(roomId).emit('receiveMessage', populatedMessage);

    } catch (error) {
      console.error('Socket sendMessage error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});