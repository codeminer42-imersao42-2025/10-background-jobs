import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Account } from "../../../src/models/account.ts";
import { Task, TaskStatus } from "../../../src/models/task.ts";
import { passwordEncrypter } from "../../../src/services/password-encrypter.ts";
import { fastify } from "../../../src/app.ts";

describe("POST: /tasks/:id/assign", () => {
  let anna: Account;
  let bob: Account;
  let task: Task;
  let token: string;

  beforeEach(async () => {
    anna = await Account.query().insert({
      name: "Anna",
      email: "anna@codeminer42.com",
      passwordHash: passwordEncrypter.encrypt("secret"),
    });

    bob = await Account.query().insert({
      name: "Bob",
      email: "bob@codeminer42.com",
      passwordHash: passwordEncrypter.encrypt("secret"),
    });

    task = await Task.query().insert({
      title: "Task to be done",
      status: TaskStatus.TODO,
      reporterId: anna.id,
    });

    const tokenResponse = await fastify.inject({
      method: "POST",
      url: "/login",
      body: { email: anna.email, password: "secret" },
    });

    token = JSON.parse(tokenResponse.body).token;
  });

  afterEach(async () => {
    await Task.query().delete();
    await Account.query().delete();
  });

  test("responds with 422 when task does not exist", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/tasks/9999/assign",
      body: {
        to: bob.id,
      },
      headers: { authorization: `Bearer ${token}` },
    });

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(422);
    expect(body).toMatchObject({ error: "Task not found" });
  });

  test("responds with 422 when target account does not exist", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: `/tasks/${task.id}/assign`,
      body: {
        to: "99999",
      },
      headers: { authorization: `Bearer ${token}` },
    });

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(422);
    expect(body).toMatchObject({ error: "Account not found" });
  });

  test("responds with the updated task", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: `/tasks/${task.id}/assign`,
      body: {
        to: bob.id,
      },
      headers: { authorization: `Bearer ${token}` },
    });

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body).toMatchObject({
      task: {
        id: expect.any(Number),
        title: "Task to be done",
        status: "TODO",
        reporterId: anna.id,
        assigneeId: bob.id,
      },
    });
  });
});
