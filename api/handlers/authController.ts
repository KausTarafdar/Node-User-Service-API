import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import { UserRepository } from "../service/userService";
import { IUser } from "../models/User";
import { loginSchema, registerSchema } from "../validators";

const userRepository = new UserRepository()

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map(err => err.message)
      });
      return;
    }
    // Add date as a date object
    const { dateOfBirth, password, ...otherUserData } = value;
    const parsedDateOfBirth = new Date(dateOfBirth);
    // hash password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds)

    const newUser = await userRepository.createNewUser({
      ...otherUserData,
      password: hashedPassword,
      dateOfBirth: parsedDateOfBirth
    });

    if (!newUser) {
      res.status(400).json({
        success: false,
        message: "Failed to create user. Check input fields.",
        error: "Invalid or missing data"
      });
      return;
    }
    else {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          gender: newUser.gender,
          dateOfBirth: newUser.dateOfBirth,
          country: newUser.country,
          createdAt: newUser.createdAt
          }
        });
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

      if (error) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map(err => err.message)
        });
        return;
      }

      const { email, password } = value;

      const user: IUser | null = await userRepository.checkUserCredentials({
        email: email,
        password: password
      });
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
        return;
      }
      else{
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
      }

    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
};
