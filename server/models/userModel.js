import { Schema, model } from "mongoose";

const userSchema = new Schema(
   {
      clerkId: {
         type: String,
         required: true,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      photo: {
         type: String,
         required: true,
      },
      firstName: {
         type: String,
      },
      lastName: {
         type: String,
      },
      creditBalance: {
         type: Number,
         default: 5,
      },
   },
   {
      timestamps: true,
   }
);

const userModel = model("user", userSchema);

export default userModel;
