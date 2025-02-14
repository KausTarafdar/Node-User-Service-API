import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import morgan, { StreamOptions } from "morgan";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import helmet from "helmet";
import { logger, loggerStream } from "./utils/logger";

const app: Application = express();

// Logging
const morganFormat = ':method :url :status :res[content-length] - :response-time ms'
app.use(morgan(morganFormat, { stream: loggerStream }));

// Helmet
app.use(helmet());

// Middleware
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
  .then(() => logger.info("MongoDB connected"))
  .catch((err: Error) => logger.error("MongoDB connection error:", err));

// Start server
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
