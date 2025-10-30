import { Queue } from "bullmq";
import { env } from "../config/env.ts";

const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

export const emailQueue = new Queue<{
  from: string;
  to: string;
  subject: string;
  text: string;
}>("email", { connection });

export const autoTaskArchivingQueue = new Queue("task-archiving", {
  connection,
});
