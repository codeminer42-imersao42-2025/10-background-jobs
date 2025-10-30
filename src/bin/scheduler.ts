import "dotenv/config";
import { autoTaskArchivingQueue } from "../jobs/queue.ts";

await autoTaskArchivingQueue.upsertJobScheduler("task-archiving", {
  // pattern: "* * * * * 1" // Every monday
  every: 10_000,
});
