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
            const userData = {
               email: data.email_address[0].email_address,
               firstName: data.first_name,
               lastName: data.last_name,
               photo: data.image_url,
            };

            await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
            res.json({
               success: true,
               message: "User updated successfully",
            });
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

export { clerkWebhooks };
