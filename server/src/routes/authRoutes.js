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
router.get("/profile", protect, getUserProfile);
router.patch("/profile", protect, updateUser);


export default router;
