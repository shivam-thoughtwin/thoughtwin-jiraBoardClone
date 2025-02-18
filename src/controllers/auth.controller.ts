import { Request, Response, NextFunction } from "express";
import {
  signup as signupService,
  login as loginService,
  forgotPassword as forgotPasswordService,
} from "../services/auth.service";

export async function signup(req: Request, res: Response, next: NextFunction) {
  console.log(">>>>>", req.body);
  try {
    const user = await signupService(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    res.status(200).json({ message: "Login successful", ...data });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    const token = await forgotPasswordService(email);
    res
      .status(200)
      .json({ message: "Password reset token generated", resetToken: token });
  } catch (error) {
    next(error);
  }
}
