"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask =
  exports.putCheckbox =
  exports.getUserTasks =
  exports.createTask =
  exports.getUserMeetings =
  exports.createMeeting =
  exports.resetPassword =
  exports.forgotPassword =
  exports.loginUser =
  exports.registerUser =
    void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateToken_1 = require("../utils/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const meeting_model_1 = __importDefault(require("../models/meeting.model"));
const task_model_1 = __importDefault(require("../models/task.model"));
//  REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { email, name, lastName, password } = req.body;
    if (!email || !password || !name || !lastName) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const exists = await user_model_1.default.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "The email is already registered" });
      return;
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await user_model_1.default.create({
      email,
      name,
      lastName,
      password: hashed,
    });
    res.status(201).json({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      token: (0, generateToken_1.generateToken)(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};
exports.registerUser = registerUser;
// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    const validPassword = await bcryptjs_1.default.compare(
      password,
      user.password
    );
    if (!validPassword) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }
    res.json({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      token: (0, generateToken_1.generateToken)(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error to login" });
  }
};
exports.loginUser = loginUser;
//FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No existe una cuenta con ese correo" });
    }
    // Crear token válido por 15 minutos
    const token = jsonwebtoken_1.default.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    // Configurar transportador de correo
    const transporter = nodemailer_1.default.createTransport({
      service: "gmail", // o tu proveedor SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetLink = `https://jgapplication.netlify.app/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Restablecer contraseña",
      html: `
    <div style="
      font-family: Arial, sans-serif;
      background-color: #f4f7fa;
      color: #333;
      padding: 30px;
      text-align: center;
    ">
      <div style="
        max-width: 480px;
        background-color: #ffffff;
        margin: 0 auto;
        border-radius: 10px;
        padding: 30px 20px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      ">

        <img src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png" 
          alt="Reset Password" 
          style="width: 80px; margin-bottom: 15px;" />

        <h2 style="color: #0d47a1;">Restablece tu contraseña</h2>

        <p style="font-size: 16px; line-height: 1.5;">
          Hola <strong>${
            user.name
          }</strong>, hemos recibido una solicitud para restablecer tu contraseña.
        </p>

        <p style="font-size: 15px; color: #555;">
          Haz clic en el siguiente botón para continuar. Este enlace expirará en <strong>15 minutos</strong>.
        </p>

        <a href="${resetLink}" target="_blank" 
          style="
            display: inline-block;
            margin: 20px 0;
            background: linear-gradient(45deg, #1976d2, #42a5f5);
            color: #fff;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 6px;
            font-weight: bold;
            transition: background 0.3s ease;
          ">
          🔐 Restablecer contraseña
        </a>

        <p style="font-size: 13px; color: #888;">
          Si no solicitaste este cambio, simplemente ignora este mensaje.
        </p>

        <hr style="border: none; height: 1px; background: #eee; margin: 25px 0;" />

        <p style="font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} Soporte Técnico. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `,
    });
    res.json({ message: "email sent for new password" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error to send the email" });
  }
};
exports.forgotPassword = forgotPassword;
// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jsonwebtoken_1.default.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await user_model_1.default.findById(decoded.id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Token inválido o usuario no encontrado" });
    }
    user.password = await bcryptjs_1.default.hash(password, 10); // asegúrate de tener bcrypt para hashearla
    await user.save();
    res.json({ message: "Password reseted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token expired or invalid" });
  }
};
exports.resetPassword = resetPassword;
// CREATE MEETING
const createMeeting = async (req, res) => {
  try {
    const { description, platform, date, time } = req.body;
    const meeting = new meeting_model_1.default({
      user: req.userId, // <- viene del JWT
      description,
      platform,
      date,
      time,
    });
    await meeting.save();
    res.status(201).json({ message: "Meeting created successfully", meeting });
  } catch (error) {
    res.status(500).json({ message: "Error creating meeting", error });
  }
};
exports.createMeeting = createMeeting;
// GET MEETINGS
const getUserMeetings = async (req, res) => {
  try {
    const meetings = await meeting_model_1.default.find({ user: req.userId });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings" });
  }
};
exports.getUserMeetings = getUserMeetings;
// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new task_model_1.default({
      user: req.userId, // <- viene del JWT
      title,
    });
    await task.save();
    res.status(201).json({ message: "Meeting created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating meeting", error });
  }
};
exports.createTask = createTask;
// GET TASKS
const getUserTasks = async (req, res) => {
  try {
    const tasks = await task_model_1.default.find({ user: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};
exports.getUserTasks = getUserTasks;
// PUT CHECKBOX
const putCheckbox = async (req, res) => {
  const task = await task_model_1.default.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
  if (task.user.toString() !== req.userId)
    return res.status(401).json({ message: "No autorizado" });
  task.completed = !task.completed;
  await task.save();
  res.json(task);
};
exports.putCheckbox = putCheckbox;
// DELETE TASK
const deleteTask = async (req, res) => {
  const task = await task_model_1.default.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
  if (task.user.toString() !== req.userId)
    return res.status(401).json({ message: "No autorizado" });
  await task.deleteOne();
  res.json({ message: "Tarea eliminada" });
};
exports.deleteTask = deleteTask;
