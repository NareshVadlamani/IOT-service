import { UserEntryModel } from "../models/userEntries";
import { ImageModel } from "../models/image";

export interface CombinedLog {
  eventId: string;
  reason: string | null;
  userEntryId: string | null;
  imageUrl: string | null;
  imageId: string | null;
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
    };
  }
}
