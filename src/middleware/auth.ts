import fp from "fastify-plugin";
import fastifyJwt from "fastify-jwt";
import { jwtOptions } from "../utils/jwt";

export const authPlugin = fp(async (fastify, opts) => {
  fastify.register(fastifyJwt, jwtOptions);

  fastify.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
