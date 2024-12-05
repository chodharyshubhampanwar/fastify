"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const password_1 = require("../utils/password");
const zod_1 = require("zod");
// Input validation schemas
const createUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(8)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
});
const createUser = async (request, reply) => {
    try {
        // Validate input
        const validatedData = createUserSchema.parse(request.body);
        const { username, email, password } = validatedData;
        // Check if user exists (check both email and username)
        const existingUser = await userModel_1.default.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return reply.status(400).send({
                message: "User already exists",
                field: existingUser.email === email ? "email" : "username",
            });
        }
        // Use the imported hashPassword utility instead of bcrypt directly
        const hashedPassword = await (0, password_1.hashPassword)(password);
        // Create user with trimmed data
        const user = new userModel_1.default({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });
        await user.save();
        // Generate JWT with expiration
        const token = request.server.jwt.sign({ id: user._id }, { expiresIn: "24h" });
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.createUser = createUser;
const getUser = async (request, reply) => {
    try {
        const { id } = request.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return reply.status(400).send({ message: "Invalid user ID format" });
        }
        const user = await userModel_1.default.findById(id).select("-password -__v").lean();
        if (!user) {
            return reply.status(404).send({ message: "User not found" });
        }
        reply.header("X-Content-Type-Options", "nosniff");
        return reply.status(200).send({ user });
    }
    catch (error) {
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
exports.getUser = getUser;
