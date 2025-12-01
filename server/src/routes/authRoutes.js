import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  getUserProfile,
  uploadProfileImage
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const avatarsDir = path.join(process.cwd(), "uploads", "avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const avatarUpload = multer({ storage: avatarStorage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, getUserProfile);
router.post("/profile", protect, updateUser);
router.post(
  "/profile/image",
  protect,
  avatarUpload.single("image"),
  uploadProfileImage
);

export default router;
