import type { RouteHandler } from "fastify";
import { Task } from "../../models/task.ts";

export const deleteTaskHandler: RouteHandler<{
  Params: { taskId: string };
}> = async (request, reply) => {
  const { taskId } = request.params;

  await Task.query().findById(taskId).patch({ archivedAt: new Date() });

  return reply.status(204).send();
};
