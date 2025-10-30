import { Worker } from "bullmq";
import { env } from "../config/env.ts";
import { mailer } from "../services/mailer.ts";
import { Task, TaskStatus } from "../models/task.ts";

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

export const emailWorker = new Worker<{
  from: string;
  to: string;
  subject: string;
  text: string;
}>(
  "email",
  async (job) => {
    console.log(job.data);

    await mailer.sendMail(job.data);
  },
  { connection }
);

export const autoTaskArchivingWorker = new Worker(
  "task-archiving",
  async (job) => {
    const archivedTasksAmount = await Task.query()
      .patch({ archivedAt: new Date() })
      .where({ status: TaskStatus.DONE })
      .andWhere({ archivedAt: null });

    console.log(`${job.id}: Archived ${archivedTasksAmount} task(s)`);
  },
  { connection }
);
