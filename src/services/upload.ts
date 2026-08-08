import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export class UploadService {
  static async uploadImage(
    fileBuffer: Buffer,
    folder = "user_avatars",
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional auto-resize
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve(result);
        },
      );

      uploadStream.end(fileBuffer);
    });
  }
}
