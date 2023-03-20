import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import user from "./routes/auth.js";
dotenv.config();
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((e) => {
    console.error(`error====>${e}`);
  });

app.use("/api/v1/auth", user);

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.listen(5000,'192.168.1.103', () => {
  console.log("listening at 5000");
});
