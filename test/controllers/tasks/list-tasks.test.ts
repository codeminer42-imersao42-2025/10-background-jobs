import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Account } from "../../../src/models/account.ts";
import { Task, TaskStatus } from "../../../src/models/task.ts";
import { passwordEncrypter } from "../../../src/services/password-encrypter.ts";
import { fastify } from "../../../src/app.ts";

describe("GET: /tasks", () => {
  let reporter: Account;
  let token: string;

  beforeEach(async () => {
    reporter = await Account.query().insert({
      name: "Anna",
      email: "anna@codeminer42.com",
      passwordHash: passwordEncrypter.encrypt("secret"),
    });

    await Task.query().insert({
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

  test("responds with 200 and the list of tasks", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/tasks",
      headers: { authorization: `Bearer ${token}` },
    });

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body).toMatchObject({
      tasks: [
        {
          id: expect.any(Number),
          title: "Add ESLint",
          status: "TODO",
          reporterId: reporter.id,
        },
      ],
    });
  });
});
