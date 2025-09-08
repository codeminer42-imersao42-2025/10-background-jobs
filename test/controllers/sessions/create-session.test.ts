import { afterEach, describe, expect, test } from "vitest";
import { fastify } from "../../../src/app.ts";
import { Account } from "../../../src/models/account.ts";
import { passwordEncrypter } from "../../../src/services/password-encrypter.ts";

describe("POST: /login", () => {
  afterEach(async () => {
    await Account.query().delete();
  });

  describe("when account is not registered", () => {
    test("responds with status code 422", async () => {
      const response = await fastify.inject({
        method: "POST",
        url: "/login",
        body: {
          email: "anna@codeminer42.com",
          password: "sekret",
        },
      });

      const body = JSON.parse(response.body);

      expect(response.statusCode).toEqual(422);
      expect(body).toEqual({ error: "Invalid e-mail or password." });
    });
  });

  test("responds with 200 and a token", async () => {
    await Account.query().insert({
      name: "Anna",
      email: "anna@codeminer42.com",
      passwordHash: passwordEncrypter.encrypt("sekret"),
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/login",
      body: {
        email: "anna@codeminer42.com",
        password: "sekret",
      },
    });

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(200);
    expect(body).toHaveProperty("token");
  });
});
