import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadResume,
  getResumeById,
  deleteResumeById,
  downloadResumeReportPdf,
} from "../controllers/resumeController.js";

const router = express.Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

router.post("/upload", protect, upload.single("resume"), uploadResume);

router.get("/:id/report/pdf", protect, downloadResumeReportPdf);

router.get("/:id", protect, getResumeById);

router.delete("/:id", protect, deleteResumeById);

export default router;
