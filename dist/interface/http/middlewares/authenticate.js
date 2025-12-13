"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const JwtService_1 = require("../../../infrastructure/services/JwtService");
const AppError_1 = require("../../../shared/errors/AppError");
const jwtService = new JwtService_1.JwtService();
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new AppError_1.AppError('No token provided', 401));
    }
    const parts = authHeader.split(' ');
    if (!parts.length || parts.length !== 2) {
        return next(new AppError_1.AppError('Token error', 401));
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return next(new AppError_1.AppError('Token malformed', 401));
    }
    try {
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
        return next();
    }
    catch (err) {
        return next(new AppError_1.AppError('Token invalid', 401));
    }
};
exports.authenticate = authenticate;
