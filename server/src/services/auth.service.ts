import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import config from "../config/config";

export async function signup(userData: Partial<IUser>): Promise<IUser> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password as string, salt);

  const user = new User({ ...userData, password: hashedPassword });
  return await user.save();
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: IUser }> {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: "1d",
  });
  return { token, user };
}

export async function forgotPassword(email: string): Promise<string> {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const resetToken = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: "15m",
  });
  return resetToken;
}
