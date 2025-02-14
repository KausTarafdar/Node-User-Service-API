import { Router } from "express";
import { searchUser } from "../handlers/userController";
import protectRoute from "../middleware/protectRoute";

const authRouter: Router = Router();

authRouter.get("/search", protectRoute, searchUser);

export default authRouter;
