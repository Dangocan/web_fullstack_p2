import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { AuthRouter, UserRouter } from "./routes";

import { connectToDatabase } from "./config/database.utils";
import { NobelRouter } from "./routes/nobel";

dotenv.config({ path: __dirname + "/../../.env" });

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
app.use(express.json());

app.use(AuthRouter, UserRouter, NobelRouter);

connectToDatabase().then(({ connectionSuccess }) => {
  app.listen(process.env.BACKEND_PORT, () => {
    console.log(
      `Application listening on ${process.env.BACKEND_URL}:${
        process.env.BACKEND_PORT
      } ${connectionSuccess ? "and successfully connected to database" : ""}`
    );
  });
});
