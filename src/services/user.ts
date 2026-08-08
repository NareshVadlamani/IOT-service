import { User, IUser } from "../models/user";

export interface CreateUserInput {
  name: string;
  imageUrl: string;
}

export class UserService {
  static async createUser(data: CreateUserInput): Promise<IUser> {
    return await User.create(data);
  }

  static async getAllUsers(): Promise<IUser[]> {
    return await User.find().sort({ createdAt: -1 });
  }
}
