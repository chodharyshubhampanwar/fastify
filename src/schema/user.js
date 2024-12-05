"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.createUserSchema = void 0;
exports.createUserSchema = {
    body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
        },
    },
};
exports.getUserSchema = {
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
            authorization: { type: 'string' },
        },
    },
};
