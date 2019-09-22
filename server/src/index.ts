import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";

(async () => {
  const app = express();
  app.get("/", ({ res }) => {
    res!.send("Helo");
  });

  const apolloServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Howdy there!"
      }
    }
  });
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`express is up running at port 4000`);
  });
})();
