import { Router } from "express";
import { removeBgImage } from "../controllers/ImageController.js";
import authUser from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const imageRouter = Router();

imageRouter.post("/remove-bg", authUser, upload.single("image"), removeBgImage);

export default imageRouter;
