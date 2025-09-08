import type { RouteHandler } from "fastify";
import { Account } from "../../models/account.ts";
import { passwordEncrypter } from "../../services/password-encrypter.ts";
import { fastify } from "../../app.ts";

export const registerAccountHandler: RouteHandler<{
  Body: { name: string; email: string; password: string };
}> = async (request, reply) => {
  const { name, email, password } = request.body;

  const account = await Account.query().insert({
    name,
    email,
    passwordHash: passwordEncrypter.encrypt(password),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return reply.status(201).send({
    token: fastify.jwt.sign({ sub: account.id }),
  });
};
