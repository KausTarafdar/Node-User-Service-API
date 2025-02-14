import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { UserRepository } from "../service/userService";
import { logger } from "../utils/logger";

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
    const decoded = jwt.verify(token!, process.env.JWT_SECRET as string);

    const { email } = decoded as { email: string };
    const user = await new UserRepository().getUserProfileByEmailOrUsername({email: email});
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
    logger.error(err)
    res.status(401).json({
      status: "error",
      errorType: 'AuthError',
      message: "Authorization token invalid"
    })
    return
  }
};

export default protectRoute;