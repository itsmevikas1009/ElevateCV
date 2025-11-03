import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 🟢 Register new user
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

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
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
    const userId = req.user.id; // comes from middleware
    const { name, company, contactNumber, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, company, contactNumber, profileImage },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
