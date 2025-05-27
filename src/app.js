import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4173",
      "http://localhost:5173",
      _conf.client_url,
    ],
    credentials: true,
  })
);

// api routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import _conf from "./config/app.config.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/applications", applicationRoutes);

export default app;
