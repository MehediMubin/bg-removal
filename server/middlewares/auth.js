import jwt from "jsonwebtoken";

// Middleware function to decode jwt token to get clerkId

const authUser = async (req, res, next) => {
   try {
      const { token } = req.headers;

      if (!token) {
         return res.json({
            success: false,
            message: "Not Authorized login again",
         });
      }

      const clerkId = jwt.decode(token).clerkId;
      req.user = req.user || {};
      req.user.clerkId = clerkId;

      next();
   } catch (error) {
      console.error("Authentication error:", error);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

export default authUser;
