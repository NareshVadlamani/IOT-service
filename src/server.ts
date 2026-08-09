import dotenv from "dotenv";
import app from "./app";
import http from "http";
import { connectDB } from "./config/db";
import { initSocket } from "./config/socket";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
initSocket(server);

// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
    );
  });
});
