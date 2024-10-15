import express from "express";
import morgan from "morgan";
import multer from "multer";
import { db } from "./db.js"

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(morgan("dev"));

app.use(express.json());

const port = process.env.PORT || 3000;

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

app.post("/api/planets/:id/image", upload.single("image"), async (req, res) => {
  const { id } = req.params;

  const fileName = req.file?.path;

  await db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName]);

  if (fileName) {
    res.status(201).json({ message: "Planet image uploaded successfully" });
  } else {
    res.status(400).json({ message: "Planet image failed to upload" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
