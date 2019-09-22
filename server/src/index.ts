import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { UserResolver } from "./UserResolver";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

(async () => {
  const app = express();
  app.get("/", ({ res }) => {
    res!.send("Helo");
  });

  // Create a connction for type orm, reads config from ormconfig.json file in the root
  createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    })
  });
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`express is up running at port 4000`);
  });
})();
