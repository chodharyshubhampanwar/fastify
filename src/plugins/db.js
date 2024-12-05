"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const mongoose_1 = __importDefault(require("mongoose"));
async function dbConnector(fastify) {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fastify');
        fastify.log.info('MongoDB connected');
    }
    catch (error) {
        fastify.log.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
exports.default = (0, fastify_plugin_1.default)(dbConnector);
