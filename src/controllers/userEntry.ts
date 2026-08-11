import { Request, Response, NextFunction } from "express";
import { emitEntryLog } from "../config/socket";
import { UserEntryService } from "../services/userEntries";
import { LogService } from "../services/log";

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
      const combinedLog = await LogService.getCombinedLog(eventId);
      emitEntryLog(
        "success",
        `User Entry '${eventId}' created successfully`,
        combinedLog,
      );
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
