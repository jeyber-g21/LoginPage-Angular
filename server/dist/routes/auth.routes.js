"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_model_1 = __importDefault(require("../models/user.model"));
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.registerUser);
router.post("/login", auth_controller_1.loginUser);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/reset-password", auth_controller_1.resetPassword);
router.post("/meeting", auth_middleware_1.protect, auth_controller_1.createMeeting);
router.get("/meetings", auth_middleware_1.protect, auth_controller_1.getUserMeetings);
router.post("/create-task", auth_middleware_1.protect, auth_controller_1.createTask);
router.get("/tasks", auth_middleware_1.protect, auth_controller_1.getUserTasks);
router.put("/:id", auth_middleware_1.protect, auth_controller_1.putCheckbox);
router.delete("/:id", auth_middleware_1.protect, auth_controller_1.deleteTask);
router.get("/dashboard/:id", auth_middleware_1.protect, async (req, res) => {
    const userId = req.params.id;
    const authUserId = req.userId;
    if (authUserId !== userId) {
        return res.status(403).json({ message: "Acceso no autorizado" });
    }
    const user = await user_model_1.default.findById(userId).select("-password");
    res.json({ message: "Bienvenido a tu dashboard", user });
});
router.put("/:id", auth_middleware_1.protect, async (req, res) => { });
exports.default = router;
