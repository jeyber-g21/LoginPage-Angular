import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import connectDB from "./config/db";

dotenv.config();
connectDB(); // <-- Conexión a MongoDB
const app = express();
app.use(
  cors({
    origin: "http://localhost:4200", // <-- Especifica tu frontend
    credentials: true, // <-- Permite el envío de cookies / headers de auth
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
