import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authorized, no token." });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(404).json({ message: "User not found." });

    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired." });
  }
};
