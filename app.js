import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config({
  path: "./config/config.env",
});
const app = express();

//using middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(cors());
app.use("/api", userRouter);

export default app;

app.use(errorMiddleware);
