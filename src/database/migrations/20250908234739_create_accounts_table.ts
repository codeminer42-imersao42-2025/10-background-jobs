import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("accounts", (table) => {
    table.increments("id").primary();

    table.string("name");
    table.string("email").unique();
    table.string("passwordHash");

    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("accounts");
}
