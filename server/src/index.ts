import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { UserResolver } from "./UserResolver";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { createAccessToken, sendRefreshToken } from "./auth";
import { User } from "./entity/User";

(async () => {
  const app = express();
  app.use(cookieParser());
  // Create a connction for type orm, reads config from ormconfig.json file in the root
  createConnection();

  app.get("/", ({ res }) => {
    res!.send("Helo");
  });

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      res.status(500);
      res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      res.status(500);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      res.status(500);
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      res.status(500);
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, user);

    return res.send({
      ok: true,
      accessToken: createAccessToken(user)
    });
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  });
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`express is up running at port 4000`);
  });
})();
