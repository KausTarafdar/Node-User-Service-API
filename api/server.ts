import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import helmet from "helmet";

const app: Application = express();

// Logging
const logStream = fs.createWriteStream(path.join(__dirname, "..", "/logs", "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: logStream }));

// Helmet
app.use(helmet());

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", async (req: Request, res: Response) => {
  res.status(200).json({
    "health": "OK"
  })
})
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

// Start server
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
