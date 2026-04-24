import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: { type: String },
    role: {
      type: String,
      enum: ["student", "mentor", "recruiter", "admin"],
      default: "student",
    },
    resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }],
    profileImage: { type: String },
    contactNumber: { type: String },
    // Extended profile fields
    bio: { type: String },
    location: { type: String },
    website: { type: String },
    linkedin: { type: String },
    github: { type: String },
    skills: [{ type: String }],
    university: { type: String },
    degree: { type: String },
    graduationYear: { type: String },
    experience: { type: String },
    jobTitle: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
