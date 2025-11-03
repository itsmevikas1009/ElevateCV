import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.put("/update", protect, updateUser);
router.get("/me", protect, getUserProfile);

export default router;
