import mongoose from "mongoose";

const connectDB = async () => {
   const rawUri = process.env.MONGODB_URI || "";
   const uri = rawUri.trim();

   if (!uri) {
      console.error("MONGODB_URI is not set. Check your .env file.");
      process.exit(1);
   }

   mongoose.connection.on("connected", () => {
      console.log("Database Connected");
   });

   try {
      await mongoose.connect(`${uri}/bg-removal`);
   } catch (err) {
      console.error("MongoDB connection error:", err.message || err);
      process.exit(1);
   }
};

export default connectDB;
