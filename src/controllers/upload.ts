import { Request, Response, NextFunction } from "express";
import { UploadService } from "../services/upload";

export class UploadController {
  static async handleImageUpload(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        res
          .status(400)
          .json({ success: false, message: "No image file provided" });
        return;
      }

      const result = await UploadService.uploadImage(req.file.buffer);

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
