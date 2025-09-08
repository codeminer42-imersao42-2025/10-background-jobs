import Knex from "knex";
import knexfile from "../../knexfile.ts";
import { env } from "../config/env.ts";

export const knex = Knex(knexfile[env.NODE_ENV]!);
