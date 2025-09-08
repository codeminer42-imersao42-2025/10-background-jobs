import type { RouteHandler } from "fastify";
import { Task, TaskStatus } from "../../models/task.ts";
import { taskSerializer } from "../../serializers/task-serializer.ts";

export const updateTaskHandler: RouteHandler<{
  Params: { taskId: string };
  Body: { title?: string; description?: string; status?: string };
}> = async (request, reply) => {
  const { taskId } = request.params;
  const { title, description, status } = request.body;

  const updatedTask = await Task.query()
    .update({
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status: status as TaskStatus }),
      updatedAt: new Date(),
    })
    .where("id", taskId)
    .returning("*")
    .first();

  return reply
    .status(200)
    .send({ task: taskSerializer.serialize(updatedTask!) });
};
