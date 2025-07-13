
let io;
const onlineUsers = new Map(); // userId -> socketId

export const setupSocket = (serverIO) => {
  io = serverIO;

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    console.log("userId from auth:", userId);

    if (!userId) {
      console.log("No userId provided in socket auth");
      socket.disconnect(true);
      return;
    }

    // Clean old socket if already connected
    const existingSocket = onlineUsers.get(userId);
    if (existingSocket && existingSocket !== socket.id) {
      console.log(`Replacing socket for user ${userId}: ${existingSocket} ➡️ ${socket.id}`);
    }

    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`Socket connected: ${socket.id} for user: ${userId}`);

    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id} for user: ${socket.userId}`);
      if (socket.userId && onlineUsers.get(socket.userId) === socket.id) {
        onlineUsers.delete(socket.userId);
      }
    });
  });
};

export const getOnlineUsers = () => onlineUsers;


export const sendNotification = (userId, notification) => {
    console.log("Trying to notify user:", userId);
    console.log("Online users map:", [...onlineUsers.entries()]);
  
    const socketId = onlineUsers.get(userId);
    if (socketId) {
      console.log(`Emitting to ${userId} on socket ${socketId}`);
      io.to(socketId).emit('new_notification', notification);
    } else {
      console.log(`Simulated email sent to ${userId}@example.com`);
    }
  };
  