import { UserModel, IUser } from "../models/user";
import { UploadService } from "./upload";

export interface CreateUserInput {
  name: string;
  imageUrl: string;
}

export class UserService {
  static async createUser(data: CreateUserInput): Promise<IUser> {
    return await UserModel.create(data);
  }

  static async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find().sort({ createdAt: -1 });
  }
}
