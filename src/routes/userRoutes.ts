import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createUser, getUser } from "../controllers/userController";
import { createUserSchema, getUserSchema } from "../validators/userValidator";

interface CreateUserRequest {
  Body: {
    username: string;
    email: string;
    password: string;
  };
}

interface GetUserRequest {
  Params: {
    id: string;
  };
}

async function userRoutes(fastify: FastifyInstance, options: any) {
  fastify.post<CreateUserRequest>(
    "/",
    { schema: createUserSchema },
    async (request: FastifyRequest<CreateUserRequest>, reply: FastifyReply) => {
      return createUser(request, reply);
    }
  );

  fastify.get<GetUserRequest>(
    "/:id",
    { preValidation: [fastify.authenticate], schema: getUserSchema },
    async (request: FastifyRequest<GetUserRequest>, reply: FastifyReply) => {
      return getUser(request, reply);
    }
  );
}

export default userRoutes;
