import { Request, Response, NextFunction } from "express";
import { emitLog } from "../config/socket";
import { UserEntryService } from "../services/userEntries";

export class UserEntryController {
  static async addUserEntry(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { reason, eventId } = req.body;

      if (!reason || !eventId) {
        res
          .status(400)
          .json({ success: false, message: "reason and eventId are required" });
        console.log("User Entry failed");

        return;
      }

      const user = await UserEntryService.createUserEntry({ reason, eventId });
      emitLog("success", `User Entry '${eventId}' created successfully`, {
        userId: user._id,
      });
      res.status(201).json({ success: true, data: user });
      console.log("User Entry created");
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsersEntries(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await UserEntryService.getAllUserEntries();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }
}
