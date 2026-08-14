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
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      if (page < 1 || limit < 1) {
        res.status(400).json({
          success: false,
          message: "page and limit must be positive integers",
        });

        return;
      }

      const { entries, pagination } = await LogService.getAllCombinedLogs(
        page,
        limit,
      );
      res.status(200).json({ success: true, data: entries, pagination });
    } catch (error) {
      next(error);
    }
  }

  static async getUserEntry(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const eventId = String(req.query.eventId);
      if (!eventId) {
        res.status(400).json({
          success: false,
          message: "EventId is required",
        });
        return;
      }

      const log = await LogService.getCombinedLogByEventId(eventId);
      res.send(200).json({ success: true, data: log });
    } catch (error) {
      next(error);
    }
  }
}
