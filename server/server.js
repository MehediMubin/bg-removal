import cors from "cors";
import "dotenv/config";
import express from "express";
import morgan from "morgan";

// App Config
const PORT = process.env.PORT || 4000;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.get("/", (req, res) => {
   res.send("API working");
});

app.listen(PORT, () => {
   console.log(`Server running on port: ${PORT}`);
});
