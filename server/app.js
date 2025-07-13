

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import { setupSocket, getOnlineUsers, sendNotification } from './socket.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import createDefaultAdmin from './config/createAdmin.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    // methods: ['GET', 'POST'], // Optional: add if needed
  },
});

setupSocket(io);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = getOnlineUsers();
  req.sendNotification = sendNotification;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    createDefaultAdmin(); // Create default manager if needed
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
