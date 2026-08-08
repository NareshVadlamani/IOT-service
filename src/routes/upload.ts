import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload";
import { UploadController } from "../controllers/upload";

const router = Router();

// Expects multipart/form-data with field name 'image'
router.post(
  "/image",
  uploadMiddleware.single("image"),
  UploadController.handleImageUpload,
);

export default router;
