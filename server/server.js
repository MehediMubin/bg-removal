import cors from "cors";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import connectDB from "./configs/mongodb.js";
import userRouter from "./routes/userRoutes.js";

// App Config
const PORT = process.env.PORT || 4000;
const app = express();
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.get("/", (req, res) => {
   res.send("API working");
});

app.use("/api/user", userRouter);

app.listen(PORT, () => {
   console.log(`Server running on port: ${PORT}`);
});
