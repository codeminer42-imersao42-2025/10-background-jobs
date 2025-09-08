import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Account } from "../../../src/models/account.ts";
import { Task, TaskStatus } from "../../../src/models/task.ts";
import { passwordEncrypter } from "../../../src/services/password-encrypter.ts";
import { fastify } from "../../../src/app.ts";

describe("PATCH: /tasks/:id", () => {
  let reporter: Account;
  let task: Task;
  let token: string;

  beforeEach(async () => {
    reporter = await Account.query().insert({
      name: "Anna",
      email: "anna@codeminer42.com",
      passwordHash: passwordEncrypter.encrypt("secret"),
    });

    task = await Task.query().insert({
      title: "Add ESLint",
      status: TaskStatus.TODO,
      reporterId: reporter.id,
    });

    const tokenResponse = await fastify.inject({
      method: "POST",
      url: "/login",
      body: { email: reporter.email, password: "secret" },
    });

    token = JSON.parse(tokenResponse.body).token;
  });

  afterEach(async () => {
    await Task.query().delete();
    await Account.query().delete();
  });

  test("responds with 200 and the updated task", async () => {
    const response = await fastify.inject({
      method: "PATCH",
      url: `/tasks/${task.id}`,
      body: {
        title: "Update ESLint config",
        status: "IN_PROGRESS",
      },
      headers: { authorization: `Bearer ${token}` },
    });

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body).toMatchObject({
      task: {
        id: expect.any(Number),
        title: "Update ESLint config",
        status: "IN_PROGRESS",
      },
    });
  });
});
