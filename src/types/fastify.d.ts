import "fastify";
import { IUser } from "../models/userModel";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }

  interface FastifyRequest {
    user: IUser;
  }
}
