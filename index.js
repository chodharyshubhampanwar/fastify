"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const db_1 = require("./src/config/db");
const auth_1 = require("./src/middleware/auth");
// Load environment variables early
dotenv_1.default.config();
// Validate required environment variables
const requiredEnvVars = ["PORT", "MONGODB_URI"]; // Add other required vars
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} is not defined in environment variables`);
        process.exit(1);
    }
}
// Server instance creation with type
const server = (0, fastify_1.default)({
    logger: {
        level: process.env.LOG_LEVEL || "info",
        transport: {
            target: "pino-pretty",
        },
    },
});
// Graceful shutdown handler
const closeGracefully = async (signal) => {
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
    await (0, db_1.connectDB)();
    // Register plugins
    server.register(auth_1.authPlugin);
    // Register routes
    server.register(userRoutes_1.default, { prefix: "/api/users" });
    // Start the server
    const start = async () => {
        try {
            const port = parseInt(process.env.PORT || "8080", 10);
            const host = process.env.HOST || "0.0.0.0";
            await server.listen({ port, host });
            server.log.info(`Server running at http://${host}:${port}`);
        }
        catch (err) {
            server.log.error(err);
            process.exit(1);
        }
    };
    start();
};
startServer();
