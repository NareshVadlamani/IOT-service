import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import type { CombinedLog } from "../services/log";

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        "https://iot.raithunestham.in",
        "https://www.iot.raithunestham.in",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling", "websocket"], // Allow both polling and websockets
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket client connected: ${socket.id}`);
  });

  return io as SocketIOServer;
};

// Global logger helper to broadcast logs to all connected frontend clients
export const emitLog = (
  level: "info" | "error" | "success",
  message: string,
  data?: unknown,
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

// Broadcasts the combined user-entry + image log to all connected frontend clients
export const emitEntryLog = (
  level: "info" | "error" | "success",
  message: string,
  data: CombinedLog,
) => {
  if (io) {
    const logPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
    io.emit("entry_log", logPayload);
  }
};
