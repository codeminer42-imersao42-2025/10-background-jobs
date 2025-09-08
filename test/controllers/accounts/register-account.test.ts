import { afterEach, describe, expect, test } from "vitest";
import { fastify } from "../../../src/app.ts";
import { Account } from "../../../src/models/account.ts";

describe("POST: /accounts", () => {
  afterEach(async () => {
    await Account.query().delete();
  });

  test("responds with 201 and a token", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/accounts",
      body: {
        name: "Anna",
        email: "anna@codeminer42.com",
        password: "sekret",
      },
    });

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(201);
    expect(body).toHaveProperty("token");
  });
});
