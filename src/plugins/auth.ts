import fastifyPlugin from 'fastify-plugin';

async function authPlugin(fastify: any) {
  fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'supersecret',
  });

  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

export default fastifyPlugin(authPlugin);
