import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();
    table.string("title");
    table.string("description").nullable();
    table.enum("status", ["TODO", "IN_PROGRESS", "DONE"]).defaultTo("TODO");

    table
      .integer("reporterId")
      .references("id")
      .inTable("accounts")
      .notNullable();
    table.integer("assigneeId").references("id").inTable("accounts").nullable();

    table.dateTime("archivedAt").nullable();

    table.timestamps(true, true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tasks");
}
