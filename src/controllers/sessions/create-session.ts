import { type RouteHandler } from "fastify";
import { Account } from "../../models/account.ts";
import { passwordEncrypter } from "../../services/password-encrypter.ts";
import { fastify } from "../../app.ts";

export const createSessionHandler: RouteHandler<{
  Body: { email: string; password: string };
}> = async (request, reply) => {
  const { email, password } = request.body;

  const account = await Account.query().findOne({
    email: email,
  });

  if (!account || !passwordEncrypter.matches(password, account.passwordHash)) {
    return reply.status(422).send({ error: "Invalid e-mail or password." });
  }

  return reply.status(200).send({
    token: fastify.jwt.sign({ sub: account.id, email: account.email }),
  });
};
