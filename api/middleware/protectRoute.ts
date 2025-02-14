import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { IUserData, UserRepository } from "../service/userService";

async function protectRoute (req: Request, res: Response, next: NextFunction): Promise<void>{
  try {
    if(!req.headers.authorization){
      res.status(401).json({
        status: "error",
        errorType: 'AuthError',
        message: "Authorization token unavaible in header"
      });
      return
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!);

    const userData: IUserData = {
        email: decoded as string,
    }

    const user = await new UserRepository().getUserProfileByEmailOrUsername(userData);
    if (!user) {
      res.status(401).json({
        status: "error",
        errorType: 'AuthError',
        message: "Authorization token invalid"
      });
      return
    }

    next();

  } catch (err) {
    res.status(401).json({
      status: "error",
      errorType: 'AuthError',
      message: "Authorization token invalid"
    })
    return
  }
};

export default protectRoute;