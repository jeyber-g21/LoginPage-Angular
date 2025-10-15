import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user.model";
import { generateToken } from "../utils/generateToken";

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
