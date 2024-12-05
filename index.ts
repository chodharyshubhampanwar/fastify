import Fastify, { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes";
import { connectDB } from "./src/config/db";
import { authPlugin } from "./src/middleware/auth";

// Load environment variables early
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["PORT", "MONGODB_URI"]; // Add other required vars
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not defined in environment variables`);
    process.exit(1);
  }
}

// Server instance creation with type
const server: FastifyInstance = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport: {
      target: "pino-pretty",
    },
  },
});

// Graceful shutdown handler
const closeGracefully = async (signal: string) => {
  server.log.info(`Received signal to terminate: ${signal}`);

  await server.close();
  process.exit(0);
};

process.on("SIGINT", () => closeGracefully("SIGINT"));
process.on("SIGTERM", () => closeGracefully("SIGTERM"));

// Register error handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  reply.status(500).send({ error: "Internal Server Error" });
});

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Register plugins
  server.register(authPlugin);

  // Register routes
  server.register(userRoutes, { prefix: "/api/users" });

  // Start the server
  const start = async () => {
    try {
      const port = parseInt(process.env.PORT || "8080", 10);
      const host = process.env.HOST || "0.0.0.0";

      await server.listen({ port, host });
      server.log.info(`Server running at http://${host}:${port}`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  start();
};

startServer();
