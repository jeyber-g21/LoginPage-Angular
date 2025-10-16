import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

//  REGISTER USER
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, name, lastName, password } = req.body;

    if (!email || !password || !name || !lastName) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "The email is already registered" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, lastName, password: hashed });

    res.status(201).json({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// LOGIN USER
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    res.json({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error to login" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No existe una cuenta con ese correo" });
    }

    // Crear token válido por 15 minutos
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    // Configurar transportador de correo
    const transporter = nodemailer.createTransport({
      service: "gmail", // o tu proveedor SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:4200/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Restablecer contraseña",
      html: `
        <h3>Hola ${user.name},</h3>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>Este enlace expira en 15 minutos.</p>
      `,
    });

    res.json({ message: "Correo enviado para restablecer la contraseña" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token inválido o usuario no encontrado" });
    }

    user.password = await bcrypt.hash(password, 10); // asegúrate de tener bcrypt para hashearla
    await user.save();

    res.json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token expirado o inválido" });
  }
};
