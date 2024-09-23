import { createServer } from "http";

const server = createServer((req, res) => {
  res.end("Benvenuti nel mio sito");
});

server.listen(3000, () => {
  console.log("Server in ascolto su http://localhost:3000");
});
