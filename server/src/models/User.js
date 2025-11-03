// server/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // ✅ must be "password"
    company: { type: String },
    role: {
      type: String,
      enum: ["student", "mentor", "recruiter"],
      default: "student",
    },
    resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }],
    // Optional user info
    profileImage: { type: String },
    contactNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
