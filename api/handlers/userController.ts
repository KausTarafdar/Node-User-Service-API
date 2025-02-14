import { Request, Response } from "express";

import { UserRepository } from "../service/userService";
import { searchUserSchema } from "../validators";

const userRepository = new UserRepository()

export const searchUser = async (req: Request, res: Response) => {
  try {
    const { error } = searchUserSchema.validate(req.query);
    if (error) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            error: error.details.map(detail => detail.message)
        });
        return;
    }

    const { username, email } = req.query;

    const user = await userRepository.getUserProfileByEmailOrUsername({
            username: username as string,
            email: email as string
    });

    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        });
        return;
    }
    else{
        res.status(200).json({
            success: true,
            message: "User found",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                country: user.country,
                createdAt: user.createdAt
            }
        });
    }

  } catch (error) {
      console.error("Error searching user:", error);
      res.status(500).json({
          success: false,
          message: "Internal server error"
      });
  }
};
