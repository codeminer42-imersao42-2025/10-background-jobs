import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    useNullAsDefault: false,
    connection: {
      filename: "./tmp/dev.sqlite3",
    },
    migrations: {
      directory: "./src/database/migrations",
    },
  },

  test: {
    client: "sqlite3",
    useNullAsDefault: false,
    connection: {
      filename: "./tmp/test.sqlite3",
    },
    migrations: {
      directory: "./src/database/migrations",
    },
  },
};

export default config;
