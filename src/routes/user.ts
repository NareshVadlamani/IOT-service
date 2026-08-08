import { Router } from "express";
import { UserController } from "../controllers/user";

const router = Router();

router.post("/", UserController.createUser);
router.get("/", UserController.getUsers);

export default router;
