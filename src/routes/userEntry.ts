import { Router } from "express";
import { UserEntryController } from "../controllers/userEntry";

const router = Router();

router.post("/add", UserEntryController.addUserEntry);
router.get("/getAll", UserEntryController.getAllUsersEntries);

export default router;
