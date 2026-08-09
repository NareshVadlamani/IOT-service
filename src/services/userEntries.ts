import { UserEntryModel, IUserEntry } from "../models/userEntries";

export interface CreateUserEntryInput {
  reason: string;
  eventId: string;
}

export class UserEntryService {
  static async createUserEntry(
    data: CreateUserEntryInput,
  ): Promise<IUserEntry> {
    return await UserEntryModel.create(data);
  }

  static async getAllUserEntries(): Promise<IUserEntry[]> {
    return await UserEntryModel.find().sort({ createdAt: -1 });
  }
}
