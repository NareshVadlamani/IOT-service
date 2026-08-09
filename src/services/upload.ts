import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { ImageModel } from "../models/image";

export class UploadService {
  static async uploadImage(
    fileBuffer: Buffer,
    folder: string,
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

  static async saveImagePath(url: string, public_id: string, eventId: string) {
    return await ImageModel.create({
      url: url,
      publicId: public_id,
      eventId: eventId,
    });
  }

  static async uploadImageAndSave(
    fileBuffer: Buffer,
    eventId: string,
    folder = "user_avatars",
  ) {
    const res = await this.uploadImage(fileBuffer, folder);
    return await ImageModel.create({
      url: res.url,
      publicId: res.public_id,
      eventId: eventId,
    });
  }
}
