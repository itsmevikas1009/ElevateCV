import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/dbConnect.js";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Root route
app.get("/", (req, res) =>
  res.send("🚀 ElevateCV server running successfully!")
);

// Start server
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
