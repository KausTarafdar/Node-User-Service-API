import { Router } from "express";
import { registerUser, loginUser} from "../handlers/authController";

const authRouter: Router = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
