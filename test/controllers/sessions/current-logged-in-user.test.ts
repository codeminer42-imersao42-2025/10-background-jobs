import { afterEach, describe, expect, test } from "vitest";
import { fastify } from "../../../src/app.ts";
import { Account } from "../../../src/models/account.ts";

describe("GET: /accounts/self", () => {
  afterEach(async () => {
    await Account.query().delete();
  });

  test("returns the account related to the token", async () => {
    const registerAccountResponse = await fastify.inject({
      method: "POST",
      url: "/accounts",
      body: {
        name: "Anna",
        email: "anna@codeminer42.com",
        password: "secret",
      },
    });

    const token = JSON.parse(registerAccountResponse.body).token;

    const response = await fastify.inject({
      method: "GET",
      url: "/accounts/self",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const body = JSON.parse(response.body);

    expect(body).toMatchObject({
      account: {
        id: expect.any(Number),
        name: "Anna",
        email: "anna@codeminer42.com",
      },
    });
  });
});
