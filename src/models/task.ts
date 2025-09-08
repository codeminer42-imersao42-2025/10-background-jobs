import { Model } from "objection";
import { knex } from "../database/knex.ts";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export class Task extends Model {
  static tableName = "tasks";

  id!: number;
  title!: string;
  description!: string | undefined;
  status!: TaskStatus;

  reporterId!: number;
  assigneeId?: number;

  createdAt!: Date;
  updatedAt!: Date;
  archivedAt!: Date;
}

Task.knex(knex);
