import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Account } from "../../../src/models/account.ts";
import { passwordEncrypter } from "../../../src/services/password-encrypter.ts";
import { fastify } from "../../../src/app.ts";
import { Task } from "../../../src/models/task.ts";

describe("POST: /tasks", async () => {
  let reporter: Account;
  let token: string;

  beforeEach(async () => {
    reporter = await Account.query().insert({
      name: "Anna",
      email: "anna@codeminer42.com",
      passwordHash: passwordEncrypter.encrypt("secret"),
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

  test("responds with 201 and the created task", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/tasks",
      headers: { authorization: `Bearer ${token}` },
      body: {
        title: "Add ESLint",
      },
    });

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(201);
    expect(body).toMatchObject({
      task: {
        id: expect.any(Number),
        title: "Add ESLint",
        status: "TODO",
      },
    });
  });
});
