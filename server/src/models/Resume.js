// server/src/models/Resume.js
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    companyName: String,
    jobTitle: String,
    jobDescription: String, // ✅ Added this field
    imagePath: String,
    resumePath: String,
    feedback: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
