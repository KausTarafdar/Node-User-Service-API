import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { UserRepository } from "../service/userService";
import { IUser } from "../models/User";

const userRepository = new UserRepository()

export const registerUser = async (req: Request, res: Response) => {
  try {
    const newUser = await userRepository.createNewUser(req.body);
    if (!newUser) {
      res.status(400).json({
        success: false,
        message: "Failed to create user. Check input fields.",
        error: "Invalid or missing data"
    });
    }
    else {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName,
            gender: newUser.gender,
            dateOfBirth: newUser.dateOfBirth,
            country: newUser.country,
            createdAt: newUser.createdAt
          }
        });
    }


  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user: IUser | null = await userRepository.checkUserCredentials(email, password);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                userId: user._id,
                username: user.username,
                email: user.email,
                token
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
