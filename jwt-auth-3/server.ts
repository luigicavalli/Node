import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { db } from "./db";
import jwt from "jsonwebtoken";
import authorize from "./authorize";
import "./passport"

const app = express();

app.use(morgan("dev"));

app.use(express.json());

dotenv.config();

const port = process.env.PORT || 3000;

app.get("/api/users", async (req, res) => {
  const users = await db.many(`SELECT * FROM users;`);
  res.status(200).json(users);
});

app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await db.one(`SELECT * FROM users WHERE username=$1`, username);

  if (user && user.password === password) {
    const payload = {
      id: user.id,
      username,
    };

    const { SECRET = "" } = process.env;

    const token = jwt.sign(payload, SECRET);

    console.log(token);

    await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token]);

    res.status(200).json({ id: user.id, username, token });
  } else {
    res.status(400).json({ message: "Username or password incorrect" });
  }
});

app.post("/api/users/signup", async (req, res) => {
  const { username, password } = req.body;

  const user = await db.oneOrNone(
    `SELECT * FROM users WHERE username=$1`,
    username
  );

  if (user) {
    res.status(409).json({ message: "This user already exists" });
  } else {
    const { id } = await db.one(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
      [username, password]
    );

    res
      .status(201)
      .json({ id, message: "Signup successful. Now you can log in." });
  }
});

app.get("/api/users/logout", authorize, async (req, res) => {
  const user: any = req.user;

  await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user?.id, null]);

  res.status(200).json({ message: "Logout successful" });
});

app.get("/api/test-auth", authorize, (req, res) => {
  res.status(200).json({ message: "You are authenticated!", user: req.user });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
