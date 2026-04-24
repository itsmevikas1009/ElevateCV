import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * Admin middleware — checks if user role is "mentor" or has admin flag.
 * For now, we allow "mentor" and "recruiter" roles to access admin.
 */
const adminOnly = (req, res, next) => {
  const allowedRoles = ["mentor", "recruiter", "admin"];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Admin access only. Not authorized." });
  }
  next();
};

// GET /api/admin/users — all users with their resumes populated
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate({
        path: "resumes",
        select: "jobTitle jobDescription companyName feedback createdAt resumePath",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// DELETE /api/admin/users/:id — delete a user and all their resumes
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToDelete.role === "admin") {
      return res.status(403).json({ message: "Cannot delete another admin" });
    }

    // Delete user's resumes
    const Resume = (await import("../models/Resume.js")).default;
    await Resume.deleteMany({ user: userToDelete._id });

    // Delete user
    await userToDelete.deleteOne();

    res.status(200).json({ success: true, message: "User and associated resumes deleted" });
  } catch (err) {
    console.error("Admin user delete error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;
