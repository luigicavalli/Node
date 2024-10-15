import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:postgres@localhost:5432/example");

const setupDb = async () => {
  await db.none(`
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    token TEXT
    );
  `);

  await db.none(
    `INSERT INTO users (username, password) VALUES ('marcorossi', '654321')`
  );
  await db.none(
    `INSERT INTO users (username, password) VALUES ('luisaverdi', '123456')`
  );
};

setupDb();

export { db };
