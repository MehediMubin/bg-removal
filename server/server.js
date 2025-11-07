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
// capture raw body for webhook signature verification (Svix / Clerk)
app.use(
   express.json({
      verify: (req, res, buf) => {
         // store raw body buffer/string for later verification
         req.rawBody = buf;
      },
   })
);
app.use(morgan("dev"));

// API routes
app.get("/", (req, res) => {
   res.send("API working");
});

app.use("/api/user", userRouter);

app.listen(PORT, () => {
   console.log(`Server running on port: ${PORT}`);
});
