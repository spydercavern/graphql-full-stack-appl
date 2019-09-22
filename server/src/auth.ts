import { User } from "./entity/User";
import { sign } from "jsonwebtoken";

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
  return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d"
  });
};
