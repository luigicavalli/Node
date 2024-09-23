import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

const schema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

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

app.get("/api/planets", (req, res) => {
  res.status(200).json(planets);
});

app.get("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  res.status(200).json(planet);
});

app.post("/api/planets", (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  planets.push(req.body);
  res.status(201).json({ msg: "The planet was created" });
});

app.put("/api/planets/:id", (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const index = planets.findIndex((p) => {
    return p.id === req.body.id;
  });
  if (index !== -1) {
    planets[index] = req.body;
  } else {
    res.status(404).json({ message: "Planet not found" });
  }
  res.status(200).json({ message: "The planet was updated" });
});

app.delete("/api/planets/:id", (req, res) => {
  const index = planets.findIndex((todo) => {
    return todo.id === Number(req.query.id);
  });
  if (index !== -1) {
    planets.splice(index, 1);
    res.status(200).json({ message: "The planet was deleted" });
  } else {
    res.status(404).json({ message: "Planet not found" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
