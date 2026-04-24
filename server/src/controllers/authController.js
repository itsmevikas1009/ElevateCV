import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, company, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All required fields missing." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      company,
      role,
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Server error." });
  }
};

// 🟢 Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "10m" });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Logout user
export const logoutUser = (req, res) => {
  // Client just removes token, but you can also handle blacklisting if needed
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

// 🟢 Update user details
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // from middleware
    const {
      name, company, contactNumber, profileImage, role,
      bio, location, website, linkedin, github, skills,
      university, degree, graduationYear, experience, jobTitle,
    } = req.body;

    const updateData = {};

    const fields = {
      name, company, contactNumber, profileImage, role,
      bio, location, website, linkedin, github, skills,
      university, degree, graduationYear, experience, jobTitle,
    };

    for (const [key, val] of Object.entries(fields)) {
      if (typeof val !== "undefined") updateData[key] = val;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate({
      path: "resumes",
      select: "jobTitle jobDescription createdAt feedback resumePath",
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🆕 Upload profile image from device
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const imagePath = `/uploads/avatars/${req.file.filename}`; // relative URL

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imagePath },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      user: updatedUser,
      imagePath,
    });
  } catch (err) {
    console.error("Upload profile image error:", err);
    return res.status(500).json({ message: err.message || "Server error." });
  }
};
