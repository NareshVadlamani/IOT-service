import { Schema, model, Document } from "mongoose";

enum LogReasonType {
  FINGER_MATCHED = "FINGER MATCHED",
  FINGER_FAILED = "FINGER FAILED",
}

export interface IUserEntry extends Document {
  reason: LogReasonType;
  eventId: string;
}

const userEntriesSchema = new Schema<IUserEntry>(
  {
    reason: {
      type: String,
      enum: Object.values(LogReasonType),
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserEntryModel = model<IUserEntry>(
  "UserEntries",
  userEntriesSchema,
);
