import "reflect-metadata";
import express from "express";

(async () => {
  const app = express();
  app.get("/", ({ res }) => {
    res!.send("Helo");
  });
  app.listen(4000, () => {
    console.log(`express is up running at port 4000`);
  });
})();
