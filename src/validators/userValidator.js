"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.createUserSchema = void 0;
exports.createUserSchema = {
    body: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
            username: { type: "string", minLength: 3, maxLength: 30 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
        },
    },
};
exports.getUserSchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
        },
    },
};
