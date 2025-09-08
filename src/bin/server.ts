import "dotenv/config";
import { fastify } from "../app.ts";

fastify.listen({ port: 8080 });
