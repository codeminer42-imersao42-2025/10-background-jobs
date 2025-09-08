import type { RouteHandler } from "fastify";
import { Task, TaskStatus } from "../../models/task.ts";
import { taskSerializer } from "../../serializers/task-serializer.ts";

export const createTaskHandler: RouteHandler<{
  Body: { title: string; description?: string };
}> = async (request, reply) => {
  const { title, description } = request.body;

  const task = await Task.query().insert({
    title,
    description,
    status: TaskStatus.TODO,
    reporterId: request.user.sub,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return reply.status(201).send({ task: taskSerializer.serialize(task) });
};
