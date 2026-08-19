import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT Key Undefined");
export const generateRefreshToken = (id: string) => {
  return jwt.sign(id, jwtSecret);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, jwtSecret);
};

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
