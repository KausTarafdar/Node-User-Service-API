import { Request, Response } from "express";

import { UserRepository } from "../service/userService";

const userRepository = new UserRepository()

export const searchUser = async (req: Request, res: Response) => {
  try {
      const { username, email } = req.query;

      if (!username && !email) {
          return res.status(400).json({
              success: false,
              message: "Provide either a username or an email to search"
          });
      }

      const user = await userRepository.getUserProfileByEmailOrUsername({ username: username as string, email: email as string });

      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found"
          });
      }

      res.status(200).json({
          success: true,
          message: "User found",
          data: {
              id: user._id,
              username: user.username,
              email: user.email,
              fullName: user.fullName,
              gender: user.gender,
              dateOfBirth: user.dateOfBirth,
              country: user.country,
              createdAt: user.createdAt
          }
      });
  } catch (error) {
      console.error("Error searching user:", error);
      res.status(500).json({
          success: false,
          message: "Internal server error"
      });
  }
};
