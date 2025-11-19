// import express from "express";
// import multer from "multer";
// import fs from "fs/promises";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const pdfParse = require("pdf-parse");

// import Resume from "../models/Resume.js";
// import { analyzeWithAI } from "../services/aiService2.js";

// const router = express.Router();
// const upload = multer({ dest: "uploads/" });

// // Upload Resume

// router.post("/upload", upload.single("resume"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   let filePath = req.file.path;

//   try {
//     // 1️⃣ Parse the uploaded PDF
//     const buffer = await fs.readFile(filePath);
//     const parsed = await pdfParse(buffer);
//     const resumeText = parsed.text?.trim() || "";

//     if (!resumeText) throw new Error("Could not extract text from resume PDF.");

//     // Collect job details from frontend
//     const jobTitle = req.body.jobTitle || "Not specified";
//     const jobDescription = req.body.jobDescription || "Not specified";
//     const companyName = req.body.companyName || "Not specified";
//     const user = req.body.user || null;

//     //Get AI analysis
//     const aiFeedback = await analyzeWithAI(
//       resumeText,
//       jobTitle,
//       jobDescription
//     );

//     const safeFeedback =
//       typeof aiFeedback === "object" && aiFeedback !== null
//         ? aiFeedback
//         : { raw: aiFeedback };

//     //  Save everything in MongoDB
//     const resumeDoc = await Resume.create({
//       user,
//       companyName,
//       jobTitle,
//       jobDescription,
//       resumePath: `/uploads/${req.file.filename}`,
//       feedback: safeFeedback,
//     });

//     // Delete temporary uploaded file
//     await fs.unlink(filePath).catch(console.error);

//     //  Respond with saved data
//     res.status(201).json({
//       success: true,
//       resumeId: resumeDoc._id,
//       jobTitle: resumeDoc.jobTitle,
//       jobDescription: resumeDoc.jobDescription,
//       feedback: safeFeedback,
//     });
//   } catch (err) {
//     console.error("❌ Upload route error:", err);
//     if (filePath) await fs.unlink(filePath).catch(() => {});
//     res.status(500).json({
//       message: "Server error during upload and analysis.",
//       error: err.message,
//     });
//   }
// });

// // Fetch the uploaded resume by id
// router.get("/:id", async (req, res) => {
//   try {
//     const resumeDoc = await Resume.findById(req.params.id);
//     if (!resumeDoc)
//       return res.status(404).json({ message: "Resume not found" });
//     res.json(resumeDoc);
//   } catch (err) {
//     console.error("❌ Fetch resume error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;