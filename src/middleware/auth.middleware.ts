import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/tokens.js";
import supabase from "../utils/connectDB.js";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization)
      return res.status(404).send({ status: "error", message: "No Token" });

    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.status(404).send({ status: "error", message: "No Token" });

    const userId = verifyToken(token);

    const { data, error } = await supabase
      .from("tenants")
      .select()
      .eq("id", userId)
      .single();

    if (!data)
      return res
        .status(404)
        .send({ status: "error", message: "User Not Found" });

    if (error) return res.status(404).send({ status: "error", message: error });

    req.user = data.id;
    next();
  } catch (error: unknown) {
    console.error(error);
    if (error) return res.status(404).send({ status: "error", message: error });
  }
};

export default authMiddleware;
