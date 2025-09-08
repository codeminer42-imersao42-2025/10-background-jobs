import type { RouteHandler } from "fastify";
import { Task } from "../../models/task.ts";
import { taskSerializer } from "../../serializers/task-serializer.ts";

export const listTasksHandler: RouteHandler = async (_request, reply) => {
  const tasks = await Task.query().whereNull("archivedAt");

  return reply.status(200).send({ tasks: taskSerializer.serializeMany(tasks) });
};
