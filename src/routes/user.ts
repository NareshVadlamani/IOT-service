import { Router } from "express";
import { UserController } from "../controllers/user";

const router = Router();

router.post("/addUser", UserController.addUser);
router.get("/", UserController.getUsers);

export default router;
