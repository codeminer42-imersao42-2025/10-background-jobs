import type { Task } from "../models/task.ts";

export const taskSerializer = {
  serialize(task: Task) {
    return {
      id: task.id,
      title: task.title,
      ...(task.description && { description: task.description }),
      status: task.status,
      reporterId: task.reporterId,
      ...(task.assigneeId && { assigneeId: task.assigneeId }),
      createdAt: new Date(task.createdAt).toISOString(),
      updatedAt: new Date(task.updatedAt).toISOString(),
    };
  },

  serializeMany(tasks: Task[]) {
    return tasks.map(this.serialize);
  },
};
