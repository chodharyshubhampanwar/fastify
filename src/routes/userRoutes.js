"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const userValidator_1 = require("../validators/userValidator");
async function userRoutes(fastify, options) {
    fastify.post("/", { schema: userValidator_1.createUserSchema }, async (request, reply) => {
        return (0, userController_1.createUser)(request, reply);
    });
    fastify.get("/:id", { preValidation: [fastify.authenticate], schema: userValidator_1.getUserSchema }, async (request, reply) => {
        return (0, userController_1.getUser)(request, reply);
    });
}
exports.default = userRoutes;
