import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
import Tesseract from "tesseract.js";

import Resume from "../models/Resume.js";
import { analyzeWithAI } from "../services/aiService.js";

// 🔹 Helper function: extract text based on file type
async function extractTextFromFile(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".pdf" || mimeType === "application/pdf") {
      const buffer = await fs.readFile(filePath);
      const parsed = await pdfParse(buffer);
      return parsed.text.trim();
    }

    if (
      ext === ".docx" ||
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value.trim();
    }

    if (
      [".jpg", ".jpeg", ".png"].includes(ext) ||
      mimeType.startsWith("image/")
    ) {
      const ocrResult = await Tesseract.recognize(filePath, "eng");
      return ocrResult.data.text.trim();
    }

    throw new Error("Unsupported file format");
  } catch (err) {
    console.error("❌ Error extracting text:", err);
    throw err;
  }
}

// 🟢 Upload Resume Controller
export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  try {
    // Extract text
    const resumeText = await extractTextFromFile(filePath, mimeType);
    if (!resumeText) throw new Error("Could not extract text from file.");

    const jobTitle = req.body.jobTitle || "Not specified";
    const jobDescription = req.body.jobDescription || "Not specified";
    const companyName = req.body.companyName || "Not specified";
    const userId = req.user?._id; // from middleware

    // Analyze with AI
    const aiFeedback = await analyzeWithAI(
      resumeText,
      jobTitle,
      jobDescription
    );
    const safeFeedback =
      typeof aiFeedback === "object" && aiFeedback !== null
        ? aiFeedback
        : { raw: aiFeedback };

    // Save to DB
    const resumeDoc = await Resume.create({
      user: userId,
      companyName,
      jobTitle,
      jobDescription,
      resumePath: `/uploads/${req.file.filename}`,
      feedback: safeFeedback,
    });

    // 🔹 Link this resume to the user's `resumes` array
    if (userId) {
      const User = (await import("../models/User.js")).default;
      await User.findByIdAndUpdate(userId, {
        $push: { resumes: resumeDoc._id },
      });
    }

    // Clean temp file
    await fs.unlink(filePath).catch(console.error);

    res.status(201).json({
      success: true,
      resumeId: resumeDoc._id,
      jobTitle: resumeDoc.jobTitle,
      jobDescription: resumeDoc.jobDescription,
      feedback: safeFeedback,
    });
  } catch (err) {
    console.error("❌ Upload route error:", err);
    await fs.unlink(filePath).catch(() => { });
    res.status(500).json({
      message: "Server error during upload and analysis.",
      error: err.message,
    });
  }
};

// 🟢 Fetch Resume by ID
export const getResumeById = async (req, res) => {
  try {
    const resumeDoc = await Resume.findById(req.params.id).populate("user", "name email role");
    if (!resumeDoc) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Ownership check:
    if (!resumeDoc.user.equals(req.user._id)) {
      return res.status(403).json({ message: "You do not have permission to view this resume." });
    }

    res.status(200).json({ success: true, resume: resumeDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Delete Resume by ID
export const deleteResumeById = async (req, res) => {
  try {
    const resumeDoc = await Resume.findById(req.params.id);
    if (!resumeDoc) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Ownership check
    if (!resumeDoc.user.equals(req.user._id)) {
      return res.status(403).json({ message: "You do not have permission to delete this resume." });
    }

    // Delete resume file from disk if it exists
    if (resumeDoc.resumePath) {
      try {
        // Assumes resumePath is like "/uploads/filename.ext"
        const uploadPath = path.join(process.cwd(), resumeDoc.resumePath);
        await fs.unlink(uploadPath);
      } catch (fileErr) {
        // Optionally log, but don't block deletion if file is already gone
        console.warn("Resume file deletion warning:", fileErr.message);
      }
    }

    // Remove from database
    await resumeDoc.deleteOne();

    // Remove reference from user's resumes array
    const User = (await import("../models/User.js")).default;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { resumes: resumeDoc._id },
    });

    res.status(200).json({ success: true, message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};