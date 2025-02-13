import { Router } from "express";
import { registerUser, loginUser } from "../handlers/userController";

const authRouter: Router = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
