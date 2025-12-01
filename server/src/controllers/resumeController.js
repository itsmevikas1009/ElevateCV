// server/src/controllers/resumeController.js
import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
import Tesseract from "tesseract.js";
import PDFDocument from "pdfkit";

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


    res.status(201).json({
      success: true,
      resumeId: resumeDoc._id,
      jobTitle: resumeDoc.jobTitle,
      jobDescription: resumeDoc.jobDescription,
      feedback: safeFeedback,
    });
  } catch (err) {
    console.error("❌ Upload route error:", err);
    res.status(500).json({
      message: "Server error during upload and analysis.",
      error: err.message,
    });
  }
};

// 🟢 Fetch Resume by ID
export const getResumeById = async (req, res) => {
  try {
    const resumeDoc = await Resume.findById(req.params.id).populate(
      "user",
      "name email role"
    );
    if (!resumeDoc) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Ownership check:
    if (String(resumeDoc.user._id) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to view this resume." });
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
    if (String(resumeDoc.user) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this resume." });
    }

    // Delete resume file from disk if it exists
    if (resumeDoc.resumePath) {
      try {
        // Assumes resumePath is like "/uploads/filename.ext"
        const uploadPath = path.join(process.cwd(), resumeDoc.resumePath);
        await fs.unlink(uploadPath);
      } catch (fileErr) {
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

    res
      .status(200)
      .json({ success: true, message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🆕 🟢 Download Resume Report as PDF
// export const downloadResumeReportPdf = async (req, res) => {
//   try {
//     const resumeDoc = await Resume.findById(req.params.id).populate(
//       "user",
//       "name email"
//     );
//     if (!resumeDoc) {
//       return res.status(404).json({ message: "Resume not found" });
//     }

//     // Ownership check
//     const ownerId = resumeDoc.user?._id || resumeDoc.user;
//     if (String(ownerId) !== String(req.user._id)) {
//       return res
//         .status(403)
//         .json({ message: "You do not have permission to download this report." });
//     }

//     const feedback = resumeDoc.feedback || {};

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="elevatecv-report-${resumeDoc._id}.pdf"`
//     );

//     const doc = new PDFDocument();
//     doc.pipe(res);

//     // Header
//     doc
//       .fontSize(20)
//       .text("ElevateCV – Resume Analysis Report", { align: "center" })
//       .moveDown(1);

//     // User & job info
//     doc.fontSize(12);
//     if (resumeDoc.user?.name) doc.text(`Name: ${resumeDoc.user.name}`);
//     if (resumeDoc.user?.email) doc.text(`Email: ${resumeDoc.user.email}`);
//     if (resumeDoc.jobTitle) doc.text(`Job Title: ${resumeDoc.jobTitle}`);
//     if (resumeDoc.companyName) doc.text(`Company: ${resumeDoc.companyName}`);
//     if (resumeDoc.createdAt)
//       doc.text(`Analyzed On: ${new Date(resumeDoc.createdAt).toLocaleString()}`);
//     doc.moveDown(1);

//     // Overall score
//     if (feedback.overallScore != null) {
//       doc
//         .fontSize(16)
//         .text(`Overall Score: ${feedback.overallScore}/100`, { underline: true })
//         .moveDown(1);
//     }

//     // Section-wise details
//     const sections = feedback.sections || feedback;
//     if (sections && typeof sections === "object") {
//       Object.entries(sections).forEach(([sectionKey, sectionVal]) => {
//         if (!sectionVal) return;

//         const prettyName = {
//           ATS: "ATS",
//           Content: "Content",
//           MetricsAndImpact: "Metrics & Impact",
//           FormattingAndStructure: "Formatting & Structure",
//           Skills: "Skills",
//           ToneAndStyle: "Tone & Style",
//         }[sectionKey] || sectionKey;

//         doc.fontSize(14).text(prettyName, { underline: true }).moveDown(0.3);

//         if (sectionVal.score != null) {
//           doc.fontSize(12).text(`Score: ${sectionVal.score}/100`).moveDown(0.2);
//         }

//         const tips = sectionVal.tips || [];
//         if (tips.length > 0) {
//           doc.fontSize(12).text("Tips:").moveDown(0.1);
//           tips.forEach((tipObj, idx) => {
//             const label =
//               tipObj.type === "good" ? "✅ Strength" : "⚠️ Improvement";
//             doc
//               .fontSize(11)
//               .text(
//                 `${idx + 1}. ${label}: ${tipObj.tip}${
//                   tipObj.explanation ? ` – ${tipObj.explanation}` : ""
//                 }`,
//                 { indent: 10 }
//               );
//           });
//         }

//         doc.moveDown(0.8);
//       });
//     }

//     doc.end();
//   } catch (err) {
//     console.error("PDF generation error:", err);
//     if (!res.headersSent) {
//       res.status(500).json({ message: "Failed to generate PDF report." });
//     }
//   }
// };

// 🆕 🟢 Download Resume Report as PDF
export const downloadResumeReportPdf = async (req, res) => {
  try {
    const resumeDoc = await Resume.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!resumeDoc) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Ownership check (only if user exists on doc)
    const ownerId = resumeDoc.user?._id || resumeDoc.user;
    if (ownerId && String(ownerId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to download this report." });
    }

    // 🧠 Normalize feedback structure
    let feedback = resumeDoc.feedback || {};

    // Sometimes AI or previous versions might store nested feedback like { feedback: { ... } }
    if (feedback.feedback && typeof feedback.feedback === "object") {
      feedback = feedback.feedback;
    }

    // If feedback is a string JSON, try parsing
    if (typeof feedback === "string") {
      try {
        feedback = JSON.parse(feedback);
      } catch (e) {
        // keep as raw string
      }
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="elevatecv-report-${resumeDoc._id}.pdf"`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text("ElevateCV – Resume Analysis Report", { align: "center" })
      .moveDown(1);

    // User & job info
    doc.fontSize(12);
    if (resumeDoc.user?.name) doc.text(`Name: ${resumeDoc.user.name}`);
    if (resumeDoc.user?.email) doc.text(`Email: ${resumeDoc.user.email}`);
    if (resumeDoc.jobTitle) doc.text(`Job Title: ${resumeDoc.jobTitle}`);
    if (resumeDoc.companyName) doc.text(`Company: ${resumeDoc.companyName}`);
    if (resumeDoc.createdAt)
      doc.text(`Analyzed On: ${new Date(resumeDoc.createdAt).toLocaleString()}`);
    doc.moveDown(1);

    // Overall score
    if (feedback.overallScore != null) {
      doc
        .fontSize(16)
        .text(`Overall Score: ${feedback.overallScore}/100`, { underline: true })
        .moveDown(1);
    }

    // Section-wise details
    // feedback.sections is the normal format used in your UI
    const sections =
      (feedback.sections && typeof feedback.sections === "object"
        ? feedback.sections
        : feedback) || {};

    if (sections && typeof sections === "object") {
      Object.entries(sections).forEach(([sectionKey, sectionVal]) => {
        if (!sectionVal) return;

        const prettyName = {
          ATS: "ATS",
          Content: "Content",
          MetricsAndImpact: "Metrics & Impact",
          FormattingAndStructure: "Formatting & Structure",
          Skills: "Skills",
          ToneAndStyle: "Tone & Style",
        }[sectionKey] || sectionKey;

        doc.fontSize(14).text(prettyName, { underline: true }).moveDown(0.3);

        if (sectionVal.score != null) {
          doc.fontSize(12).text(`Score: ${sectionVal.score}/100`).moveDown(0.2);
        }

        const tips = sectionVal.tips || [];
        if (tips.length > 0) {
          doc.fontSize(12).text("Tips:").moveDown(0.1);
          tips.forEach((tipObj, idx) => {
            const label =
              tipObj.type === "good" ? "✅ Strength" : "⚠️ Improvement";
            doc
              .fontSize(11)
              .text(
                `${idx + 1}. ${label}: ${tipObj.tip}${
                  tipObj.explanation ? ` – ${tipObj.explanation}` : ""
                }`,
                { indent: 10 }
              );
          });
        }

        doc.moveDown(0.8);
      });
    }

    // Fallback if nothing parsed
    if (!feedback.overallScore && !sections.ATS && !sections.Content) {
      doc
        .moveDown(1)
        .fontSize(12)
        .text(
          "No structured section-wise feedback was found for this resume. Try re-analyzing with the latest version of ElevateCV.",
          { align: "left" }
        );
    }

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate PDF report." });
    }
  }
};
