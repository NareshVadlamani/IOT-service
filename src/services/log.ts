import { UserEntryModel } from "../models/userEntries";
import { ImageModel } from "../models/image";
import mongoose from "mongoose";

export interface CombinedLog {
  eventId: string;
  reason: string | null;
  userEntryId: string | null;
  imageUrl: string | null;
  imageId: string | null;
  createdAt: Date | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedCombinedLogs {
  entries: CombinedLog[];
  pagination: PaginationMeta;
}

export class LogService {
  static async getCombinedLog(eventId: string): Promise<CombinedLog> {
    const [userEntry, image] = await Promise.all([
      UserEntryModel.findOne({ eventId }),
      ImageModel.findOne({ eventId }),
    ]);

    return {
      eventId,
      reason: userEntry?.reason ?? null,
      userEntryId: userEntry?.id ?? null,
      imageUrl: image?.url ?? null,
      imageId: image?.id ?? null,
      createdAt: userEntry?.createdAt ?? null,
    };
  }

  static async getAllCombinedLogs(
    page: number,
    limit: number,
  ): Promise<PaginatedCombinedLogs> {
    const skip = (page - 1) * limit;

    const [entries, [totalResult]] = await Promise.all([
      UserEntryModel.aggregate<CombinedLog>([
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$eventId",
            reason: { $first: "$reason" },
            userEntryId: { $first: "$_id" },
            createdAt: { $first: "$createdAt" },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: ImageModel.collection.name,
            localField: "_id",
            foreignField: "eventId",
            as: "image",
          },
        },
        {
          $project: {
            _id: 0,
            eventId: "$_id",
            reason: 1,
            userEntryId: 1,
            createdAt: 1,
            imageUrl: { $arrayElemAt: ["$image.url", 0] },
            imageId: { $arrayElemAt: ["$image._id", 0] },
          },
        },
      ]),
      UserEntryModel.aggregate<{ total: number }>([
        { $group: { _id: "$eventId" } },
        { $count: "total" },
      ]),
    ]);

    const total = totalResult?.total ?? 0;

    return {
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Inside your Service / Class:
  static async getCombinedLogByEventId(
    eventId: string,
  ): Promise<CombinedLog | null> {
    // Convert eventId string to Mongo ObjectId if valid
    const targetEventId = mongoose.Types.ObjectId.isValid(eventId)
      ? new mongoose.Types.ObjectId(eventId)
      : eventId;

    const [log] = await UserEntryModel.aggregate<CombinedLog>([
      // 1. Filter specifically for this eventId
      { $match: { eventId: targetEventId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$eventId",
          reason: { $first: "$reason" },
          userEntryId: { $first: "$_id" },
          createdAt: { $first: "$createdAt" },
        },
      },
      // 2. Lookup matching image using eventId
      {
        $lookup: {
          from: ImageModel.collection.name,
          localField: "_id",
          foreignField: "eventId",
          as: "image",
        },
      },
      // 3. Shape the output payload
      {
        $project: {
          _id: 0,
          eventId: "$_id",
          reason: 1,
          userEntryId: 1,
          createdAt: 1,
          imageUrl: { $arrayElemAt: ["$image.url", 0] },
          imageId: { $arrayElemAt: ["$image._id", 0] },
        },
      },
    ]);

    return log || null;
  }
}
