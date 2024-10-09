import express from "express";
import morgan from "morgan";
import pgPromise from "pg-promise";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

const port = process.env.PORT || 3000;

const db = pgPromise()("postgres://postgres:postgres@localhost:5432/example");

const setupDb = async () => {
  await db.none(`
    DROP TABLE IF EXISTS planets;

    CREATE TABLE planets (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
    );
  `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
};

setupDb();

console.log(db);

app.get("/api/planets", async (req, res) => {
  const planets = await db.many(`SELECT * FROM planets;`);
  res.status(200).json(planets);
});

app.get("/api/planets/:id", async (req, res) => {
  const { id } = req.params;

  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id=$1;`,
    Number(id)
  );

  res.status(200).json(planet);
});

app.post("/api/planets", async (req, res) => {
  const { name } = req.body;

  const newPlanet = { name };

  await db.oneOrNone(`INSERT INTO planets (name) VALUES ($1)`, name);

  res.status(201).json({ message: "The planet was created" });
});

app.put("/api/planets/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);

  res.status(200).json({ message: "The planet was updated" });
});

app.delete("/api/planets/:id", async (req, res) => {
  const { id } = req.params;

  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

  res.status(200).json({ message: "The planet was deleted" });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
