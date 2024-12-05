"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const db_1 = __importDefault(require("./src/plugins/db"));
const auth_1 = __importDefault(require("./src/plugins/auth"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const buildApp = () => {
    const app = (0, fastify_1.default)({ logger: true });
    // Plugins
    app.register(db_1.default);
    app.register(auth_1.default);
    // Routes
    app.register(userRoutes_1.default);
    return app;
};
exports.default = buildApp;
