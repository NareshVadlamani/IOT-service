import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  eventId: mongoose.Types.ObjectId | string;
  url: string;
  publicId: string;
  createdAt: Date;
}

const ImageSchema: Schema = new Schema({
  eventId: {
    type: String, // Or String if your eventId is a custom string ID
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ImageModel = mongoose.model<IImage>("Image", ImageSchema);
