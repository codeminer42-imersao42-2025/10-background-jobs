import type { FastifyPluginAsync } from "fastify";
import { registerAccountHandler } from "./register-account.ts";

export const accountsController: FastifyPluginAsync = async (
  fastify,
  _options
) => {
  fastify.post("/accounts", registerAccountHandler);
};
