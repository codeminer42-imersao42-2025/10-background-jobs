import type { FastifyPluginAsync } from "fastify";
import { createTaskHandler } from "./create-task.ts";
import { listTasksHandler } from "./list-tasks.ts";
import { assignTaskHandler } from "./assign-task.ts";
import { deleteTaskHandler } from "./delete-task.ts";
import { updateTaskHandler } from "./update-task.ts";

export const tasksController: FastifyPluginAsync = async (
  fastify,
  _options
) => {
  fastify.get(
    "/tasks",
    { preHandler: [fastify.authenticate] },
    listTasksHandler
  );

  fastify.post<{ Body: { title: string; description?: string } }>(
    "/tasks",
    { preHandler: [fastify.authenticate] },
    createTaskHandler
  );

  fastify.post<{
    Body: { to: string };
    Params: { taskId: string };
  }>(
    "/tasks/:taskId/assign",
    { preHandler: [fastify.authenticate] },
    assignTaskHandler
  );

  fastify.patch<{
    Params: { taskId: string };
    Body: { title?: string; description?: string; status?: string };
  }>(
    "/tasks/:taskId",
    { preHandler: [fastify.authenticate] },
    updateTaskHandler
  );

  fastify.delete<{ Params: { taskId: string } }>(
    "/tasks/:taskId",
    { preHandler: [fastify.authenticate] },
    deleteTaskHandler
  );
};
