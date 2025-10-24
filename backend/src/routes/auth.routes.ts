import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  createMeeting,
  getUserMeetings,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import User, { IUser } from "../models/user.model";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/meeting", protect, createMeeting);
router.get("/meetings", protect, getUserMeetings);
router.get("/dashboard/:id", protect, async (req, res) => {
  const userId = req.params.id;
  const authUserId = (req as any).userId;

  if (authUserId !== userId) {
    return res.status(403).json({ message: "Acceso no autorizado" });
  }

  const user = await User.findById(userId).select("-password");
  res.json({ message: "Bienvenido a tu dashboard", user });
});

export default router;
