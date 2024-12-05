import { FastifyRequest, FastifyReply } from "fastify";
import User, { IUser } from "../models/userModel";
import { hashPassword, comparePasswords } from "../utils/password";
import { z } from "zod";

interface CreateUserRequest extends FastifyRequest {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

interface GetUserRequest extends FastifyRequest {
  params: {
    id: string;
  };
}

// Input validation schemas
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
});

export const createUser = async (
  request: CreateUserRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    // Validate input
    const validatedData = createUserSchema.parse(request.body);
    const { username, email, password } = validatedData;

    // Check if user exists (check both email and username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return reply.status(400).send({
        message: "User already exists",
        field: existingUser.email === email ? "email" : "username",
      });
    }

    // Use the imported hashPassword utility instead of bcrypt directly
    const hashedPassword = await hashPassword(password);

    // Create user with trimmed data
    const user: IUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT with expiration
    const token = request.server.jwt.sign(
      { id: user._id },
      { expiresIn: "24h" }
    );

    // Set security headers
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("X-Frame-Options", "DENY");

    return reply.status(201).send({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Validation error",
        errors: error.errors,
      });
    }

    request.server.log.error({
      err: error,
      msg: "Failed to create user",
      userId: request.body.email,
    });

    return reply.status(500).send({
      message: "An error occurred while creating your account",
    });
  }
};

export const getUser = async (
  request: GetUserRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { id } = request.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return reply.status(400).send({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id).select("-password -__v").lean();

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    reply.header("X-Content-Type-Options", "nosniff");
    return reply.status(200).send({ user });
  } catch (error) {
    request.server.log.error({
      err: error,
      msg: "Failed to fetch user",
      userId: request.params.id,
    });

    return reply.status(500).send({
      message: "An error occurred while fetching the user",
    });
  }
};
