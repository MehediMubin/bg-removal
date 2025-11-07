import { Router } from "express";
import { clerkWebhooks } from "../controllers/UserController.js";

const userRouter = Router();

userRouter.post("/webhooks", clerkWebhooks);

export default userRouter;
