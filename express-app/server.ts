import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})