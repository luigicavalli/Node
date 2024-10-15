import express from "express";
import morgan from "morgan";
import { db } from "./db";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/api/users", async (req, res) => {
  const users = await db.many(`SELECT * FROM users;`);
  res.status(200).json(users);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
