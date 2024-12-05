import { FastifySchema } from "fastify";

export const createUserSchema: FastifySchema = {
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

export const getUserSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", pattern: "^[0-9a-fA-F]{24}$" },
    },
  },
};
