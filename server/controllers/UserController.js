import { Webhook } from "svix";
import userModel from "../models/userModel.js";

// API controller functoin to manage Clerk user with database
// http://localhost:5000/api/user/webhooks

const clerkWebhooks = async (req, res) => {
   try {
      // create a Svix instance with clerk webhook secret.
      const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

      // Use raw body if available (set by express.json verify) to avoid
      // signature mismatches caused by JSON re-stringify.
      const raw = req.rawBody || (req.body && JSON.stringify(req.body));

      await whook.verify(raw, {
         "svix-id": req.headers["svix-id"],
         "svix-timestamp": req.headers["svix-timestamp"],
         "svix-signature": req.headers["svix-signature"],
      });

      const { data, type } = req.body || {};

      // Debug: log the incoming event type so we can confirm webhooks arrive
      console.log("Clerk webhook received:", type);

      switch (type) {
         case "user.created": {
            // Safely extract email and photo (Clerk payloads may vary)
            const email =
               data?.email_addresses?.[0]?.email_address ||
               data?.email_address?.[0]?.email_address ||
               data?.primary_email ||
               data?.email ||
               "";

            const photo = data?.image_url || data?.profile_image_url || "";

            if (!email) {
               console.error(
                  "Webhook missing required email field on user.created",
                  {
                     dataKeys: Object.keys(data || {}),
                  }
               );
               return res.status(400).json({
                  success: false,
                  message: "Missing email in webhook payload",
               });
            }

            const userData = {
               clerkId: data.id,
               email,
               firstName: data.first_name,
               lastName: data.last_name,
               photo,
            };

            try {
               await userModel.create(userData);
            } catch (dbErr) {
               console.error("Failed to create user in DB:", dbErr);
               return res
                  .status(500)
                  .json({ success: false, message: "DB create failed" });
            }

            res.json({ success: true, message: "User created successfully" });
            break;
         }
         case "user.updated": {
            // Safely extract email and photo (payloads may vary)
            const email =
               data?.email_addresses?.[0]?.email_address ||
               data?.email_address?.[0]?.email_address ||
               data?.primary_email ||
               data?.email ||
               "";

            const photo = data?.image_url || data?.profile_image_url || "";

            const userData = {
               ...(email ? { email } : {}),
               firstName: data?.first_name,
               lastName: data?.last_name,
               ...(photo ? { photo } : {}),
            };

            try {
               await userModel.findOneAndUpdate(
                  { clerkId: data?.id },
                  userData,
                  { upsert: true, new: true }
               );
            } catch (dbErr) {
               console.error("Failed to update user in DB:", dbErr);
               return res
                  .status(500)
                  .json({ success: false, message: "DB update failed" });
            }

            res.json({ success: true, message: "User updated successfully" });
            break;
         }
         case "user.deleted": {
            await userModel.findOneAndDelete({ clerkId: data.id });
            res.json({
               success: true,
               message: "User deleted successfully",
            });
            break;
         }
         default:
            break;
      }
   } catch (error) {
      console.error("Webhook verification failed:", error);
      res.json({
         success: false,
         message: error.message,
      });
      return;
   }
};

// API controller function to get user available credits data
const getUserAvailableCredits = async (req, res) => {
   try {
      // Prefer clerkId set by auth middleware (req.user), but allow body fallback
      const clerkId = req.user?.clerkId || req.body?.clerkId;

      if (!clerkId) {
         return res.json({
            success: false,
            message: "Missing clerkId",
         });
      }

      const userData = await userModel.findOne({ clerkId });

      if (!userData) {
         return res.json({
            success: false,
            message: "User not found",
         });
      }

      return res.json({
         success: true,
         credits: userData.creditBalance,
      });
   } catch (error) {
      console.error("Failed to get user credits:", error);
      return res.status(500).json({
         success: false,
         message: error.message,
      });
   }
};

export { clerkWebhooks, getUserAvailableCredits };
