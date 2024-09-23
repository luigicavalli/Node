import { Request, Response } from "express";
import Joi from "joi";

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

const schema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

const getAll = (req: Request, res: Response) => {
  res.status(200).json(planets);
};
const getOne = (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  res.status(200).json(planet);
};
const create = (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  const { id, name } = req.body;
  const newPlanet = { id, name };

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  planets = [...planets, newPlanet];
  res.status(201).json({ msg: "The planet was created" });
};
const updateById = (req: Request, res: Response) => {
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
};
const deleteById = (req: Request, res: Response) => {
  const index = planets.findIndex((todo) => {
    return todo.id === Number(req.query.id);
  });
  if (index !== -1) {
    planets.splice(index, 1);
    res.status(200).json({ message: "The planet was deleted" });
  } else {
    res.status(404).json({ message: "Planet not found" });
  }
};

export { getAll, getOne, create, updateById, deleteById };
