"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPlugin = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const fastify_jwt_1 = __importDefault(require("fastify-jwt"));
const jwt_1 = require("../utils/jwt");
exports.authPlugin = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    fastify.register(fastify_jwt_1.default, jwt_1.jwtOptions);
    fastify.decorate("authenticate", async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
});
