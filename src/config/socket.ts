import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // Adjust to your Next.js domain (e.g. 'https://raithunestham.in') in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Global logger helper to broadcast logs to all connected frontend clients
export const emitLog = (
  level: "info" | "error" | "success",
  message: string,
  data?: any,
) => {
  if (io) {
    const logPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
    io.emit("new_log", logPayload);
  }
};

export const emitImageUpload = (
  level: "info" | "error" | "success",
  message: string,
  data?: any,
) => {
  if (io) {
    const logPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
    io.emit("new_image", logPayload);
  }
};
