import type { RouteHandler } from "fastify";
import { Task } from "../../models/task.ts";
import { Account } from "../../models/account.ts";
import { taskSerializer } from "../../serializers/task-serializer.ts";
import { emailQueue } from "../../jobs/queue.ts";

export const assignTaskHandler: RouteHandler<{
  Body: { to: string };
  Params: { taskId: string };
}> = async (request, reply) => {
  const { taskId } = request.params;
  const { to } = request.body;

  const task = await Task.query().findById(taskId);

  if (!task) {
    return reply.status(422).send({ error: "Task not found" });
  }

  const account = await Account.query().findById(to);

  if (!account) {
    return reply.status(422).send({ error: "Account not found" });
  }

  const updatedTask = await Task.query()
    .findById(taskId)
    .patch({ assigneeId: Number(account.id), updatedAt: new Date() })
    .returning("*")
    .first();

  // When assigning a task to a different account, send an
  // email to the account which the task was assigned to
  if (account.id !== request.user.sub) {
    const mail = {
      from: "noreply@codeminer42.com",
      to: account.email,
      subject: "Task assigned to you",
      text: `
      Hello, ${account.name}!

      ${request.user.email} have assigned the task "${task.title}" to you.
      `.trim(),
    };

    await emailQueue.add(`task-assigned - ${account.email}`, mail, {
      attempts: 5,
    });
  }

  return reply
    .status(200)
    .send({ task: taskSerializer.serialize(updatedTask!) });
};
