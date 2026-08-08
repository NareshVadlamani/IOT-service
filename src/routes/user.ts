import { Router } from "express";
import { UserController } from "../controllers/user";

const router = Router();

router.post("/addUser", UserController.createUser);
router.get("/", UserController.getUsers);

export default router;
