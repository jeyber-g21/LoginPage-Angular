import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, (req, res) => {
  res.json({ message: "Ruta protegida", userId: (req as any).userId });
});

export default router;
