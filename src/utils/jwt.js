"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtOptions = void 0;
exports.jwtOptions = {
    secret: process.env.JWT_SECRET || "your_jwt_secret",
};
