import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { MyContext } from "./ApolloContext";
import { verify } from "jsonwebtoken";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  // format bearer asdlfa;sdlkfa
  if (!authorization) {
    throw new Error("Not Authenticated");
  }
  try {
    const [, token] = authorization.split(" ");
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("Error Authenticating..");
  }
  return next();
};
