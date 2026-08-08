import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoutes from "./routes/user";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/users", userRoutes);

// Centralized Error Handler Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, error: err.message || "Internal Server Error" });
});

export default app;
