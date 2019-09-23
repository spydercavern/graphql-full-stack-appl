import { User } from "./entity/User";
import { sign } from "jsonwebtoken";
import { Response } from "express";

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user.id, userEmail: user.email },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m"
    }
  );
};

export const createRefreshtoken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d"
    }
  );
};

export const sendRefreshToken = (res: Response, user: User) => {
  res.cookie("jid", createRefreshtoken(user), { httpOnly: true });
};
