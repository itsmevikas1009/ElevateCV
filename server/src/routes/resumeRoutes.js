// import express from "express";
// import multer from "multer";
// import { protect } from "../middleware/authMiddleware.js";
// import { uploadResume, getResumeById } from "../controllers/resumeController.js";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// // 🟢 Upload Resume (protected)
// router.post("/upload", protect, upload.single("resume"), uploadResume);

// // 🟢 Get Resume by ID
// router.get("/:id", protect, getResumeById);

// export default router;

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadResume,
  getResumeById,
} from "../controllers/resumeController.js";

const router = express.Router();

// ✅ Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 🟢 Upload Resume (protected)
router.post("/upload", protect, upload.single("resume"), uploadResume);

// 🟢 Get Resume by ID
router.get("/:id", protect, getResumeById);

export default router;
