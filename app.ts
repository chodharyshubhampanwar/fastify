import fastify from "fastify";
import dbConnector from "./src/plugins/db";
import authPlugin from "./src/plugins/auth";
import userRoutes from "./src/routes/userRoutes";

const buildApp = () => {
  const app = fastify({ logger: true });

  // Plugins
  app.register(dbConnector);
  app.register(authPlugin);

  // Routes
  app.register(userRoutes);

  return app;
};

export default buildApp;
