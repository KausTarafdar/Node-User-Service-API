import { Router } from "express";
import { searchUser } from "../handlers/userController";

const authRouter: Router = Router();

authRouter.get("/search", searchUser);

export default authRouter;
