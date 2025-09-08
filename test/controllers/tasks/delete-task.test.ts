import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Account } from "../../../src/models/account.ts";
import { Task, TaskStatus } from "../../../src/models/task.ts";
import { passwordEncrypter } from "../../../src/services/password-encrypter.ts";
import { fastify } from "../../../src/app.ts";

describe("DELETE: /tasks/:id", () => {
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

  test("responds with 204", async () => {
    const response = await fastify.inject({
      method: "DELETE",
      url: `/tasks/${task.id}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toEqual(204);
  });
});
