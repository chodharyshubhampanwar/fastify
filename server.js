// ESM
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});
// CommonJs

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
