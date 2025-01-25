import { Request, Response } from "express";
import { register, login } from "../services/authServices";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const token = await register(email, password, username);
    res.status(201).json({ token });
  } catch (error) {
    res
      .status(400)
      .json({
        message:
          error instanceof Error ? error.message : "Error registering user",
      });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res
      .status(400)
      .json({
        message:
          error instanceof Error ? error.message : "Error sigining in user",
      });
  }
};
