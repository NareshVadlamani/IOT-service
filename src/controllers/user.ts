import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user";
import { emitLog } from "../config/socket";
export class UserController {
  static async addUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, imageUrl } = req.body;

      if (!name || !imageUrl) {
        res
          .status(400)
          .json({ success: false, message: "Name and imageUrl are required" });
        console.log("User creation failed");

        return;
      }

      const user = await UserService.createUser({ name, imageUrl });
      emitLog("success", `User '${name}' created successfully`, {
        userId: user._id,
      });
      res.status(201).json({ success: true, data: user });
      console.log("User created");
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }
}
