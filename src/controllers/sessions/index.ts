import type { FastifyPluginAsync } from "fastify";
import { createSessionHandler } from "./create-session.ts";
import { currentLoggedInUserHandler } from "./current-logged-in-user.ts";

export const sessionsController: FastifyPluginAsync = async (
  fastify,
  _options
) => {
  fastify.post("/login", createSessionHandler);

  fastify.get(
    "/accounts/self",
    { preHandler: [fastify.authenticate] },
    currentLoggedInUserHandler
  );
};
