import { Model } from "objection";
import { knex } from "../database/knex.ts";

export class Account extends Model {
  static tableName = "accounts";

  id!: number;
  name!: string;
  email!: string;
  passwordHash!: `${string}.${string}`;

  createdAt!: Date;
  updatedAt!: Date;
}

Account.knex(knex);
