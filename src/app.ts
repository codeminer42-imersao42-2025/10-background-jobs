import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { accountsController } from "./controllers/accounts/index.ts";
import { sessionsController } from "./controllers/sessions/index.ts";
import fastifyJwt from "@fastify/jwt";
import { tasksController } from "./controllers/tasks/index.ts";

export const fastify = Fastify({
  logger: false,
});

fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET! });

fastify.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }
);

fastify.register(sessionsController);
fastify.register(accountsController);
fastify.register(tasksController);
