import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// ✅ Path backend के लिए: /api/auth/register और /api/auth/login
router.post("/signup", register);  // frontend के लिए signup path
router.post("/login", login);

export default router;

