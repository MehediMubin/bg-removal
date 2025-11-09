import cors from "cors";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import connectDB from "./configs/mongodb.js";
import imageRouter from "./routes/imageRoutes.js";
import userRouter from "./routes/userRoutes.js";

// App Config
const PORT = process.env.PORT || 4000;
const app = express();
await connectDB();

// Middlewares
app.use(
   cors({
      origin: "https://bg-removal-client-rust.vercel.app",
      credentials: true,
   })
);
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.get("/", (req, res) => {
   res.send("API working");
});

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);

app.listen(PORT, () => {
   console.log(`Server running on port: ${PORT}`);
});
