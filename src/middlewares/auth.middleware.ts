import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

interface JwtPayload {
  id: string;
  role: "developer" | "manager";
}

export const protect: RequestHandler = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token: string = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.user = { _id: decoded.id, role: decoded.role };
      return next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }

  res.status(401).json({ message: "Not authorized, no token" });
  return;
};
