import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { getAll, getOne, create, updateById, deleteById } from "./controllers/planets";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOne);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
