// utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string): Promise<Socket> => {
  console.log("user", userId)
  return new Promise((resolve, reject) => {
    // if (!userId) {
    //   console.error("⛔ No userId provided in socket auth");
    //   return reject("No userId provided");
    // }

    if (socket) {
      if (socket.connected) {
        console.log("⚠️ Socket already connected:", socket.id);
        return resolve(socket);
      } else {
        socket.disconnect();
      }
    }

    socket = io("http://localhost:5000", {
      auth: { userId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
      resolve(socket!);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      reject(err);
    });
  });
};

export const getSocket = () => socket;
