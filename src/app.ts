import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user";
import uploadRoutes from "./routes/upload";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Centralized Error Handler Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, error: err.message || "Internal Server Error" });
});

export default app;
