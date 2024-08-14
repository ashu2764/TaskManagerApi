import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    orgion: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

// Import Routes
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js"

//routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter)

export { app };
