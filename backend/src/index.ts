import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { connectToDatabase } from "./config/database.utils";

dotenv.config({ path: __dirname + "/../../.env" });

const app = express();
app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

connectToDatabase().then(({ connectionSuccess }) => {
  app.listen(process.env.BACKEND_PORT, () => {
    console.log(
      `Application listening on ${process.env.BACKEND_URL}:${
        process.env.BACKEND_PORT
      } ${connectionSuccess ? "and successfully connected to database" : ""}`
    );
  });
});
