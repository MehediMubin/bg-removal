import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import userModel from "../models/userModel.js";

// Helper function to remove background via ClipDrop
async function removeBackgroundViaClipDrop(imagePath, apiKey) {
   const imageFile = fs.createReadStream(imagePath);
   const formData = new FormData();
   formData.append("image_file", imageFile);

   const axiosHeaders = {
      ...formData.getHeaders(),
      "x-api-key": apiKey,
   };

   const response = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
         headers: axiosHeaders,
         responseType: "arraybuffer",
      }
   );

   return response.data;
}

// Controller function to remove bg from image
const removeBgImage = async (req, res) => {
   try {
      const clerkId = req.user?.clerkId || req.body?.clerkId;

      const user = await userModel.findOne({ clerkId });

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      if (user.creditBalance <= 0) {
         return res.status(400).json({
            success: false,
            message: "Insufficient credits",
            creditBalance: user.creditBalance,
         });
      }

      if (!req.file || !req.file.path) {
         return res.status(400).json({
            success: false,
            message: "No file uploaded",
         });
      }

      const apiKey = (process.env.CLIPDROP_API_KEY || "").replace(
         /^'+|'+$/g,
         ""
      );

      let responseData;
      try {
         console.debug("Attempting remove-background via ClipDrop...");
         responseData = await removeBackgroundViaClipDrop(
            req.file.path,
            apiKey
         );
         console.debug("ClipDrop remove-background succeeded");
      } catch (clipdropError) {
         console.error(
            "ClipDrop remove-background failed:",
            clipdropError.message
         );
         throw clipdropError;
      }

      const base64Image = Buffer.from(responseData, "binary").toString(
         "base64"
      );
      const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

      await userModel.findByIdAndUpdate(user._id, {
         creditBalance: user.creditBalance - 1,
      });

      return res.json({
         success: true,
         message: "Background removed successfully",
         image: resultImage,
         creditBalance: user.creditBalance - 1,
      });
   } catch (error) {
      console.error("Background removal error:", error.message || error);
      const statusCode = error.response?.status || 500;
      let errorMessage = error.message;

      // Decode ClipDrop error responses if available
      if (error.response && error.response.data) {
         try {
            const buf = Buffer.isBuffer(error.response.data)
               ? error.response.data
               : Buffer.from(String(error.response.data));
            errorMessage = buf.toString("utf8");
         } catch (e) {
            // ignore
         }
      }

      return res.status(statusCode).json({
         success: false,
         message: errorMessage,
      });
   }
};

export { removeBgImage };
