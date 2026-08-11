import { Request, Response, NextFunction } from "express";
import { UploadService } from "../services/upload";
import { LogService } from "../services/log";
import { emitEntryLog } from "../config/socket";

export class UploadController {
  static async handleImageUpload(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { eventId } = req.body; // 👈 Extracted from multipart form-data
    const file = req.file;
    try {
      if (!file) {
        res
          .status(400)
          .json({ success: false, message: "No image file provided" });
        console.log("image uploader failed");
        return;
      }
      // 1. Validation checks
      if (!eventId) {
        return res.status(400).json({
          success: false,
          error: "eventId is required in form-data",
        });
      }

      const result = await UploadService.uploadImageAndSave(
        file.buffer,
        eventId,
      );
      console.log("image uploader success");

      const combinedLog = await LogService.getCombinedLog(eventId);
      emitEntryLog(
        "success",
        "Image upload created successfully",
        combinedLog,
      );

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: result.url,
          public_id: result.publicId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
