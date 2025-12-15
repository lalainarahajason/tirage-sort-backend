"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = void 0;
const JwtService_1 = require("../../../infrastructure/services/JwtService");
const jwtService = new JwtService_1.JwtService();
/**
 * Optional authentication middleware
 * Attaches user to request if valid token is provided, but doesn't block if not
 * This allows routes to be accessible both authenticated and unauthenticated
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // No token provided, continue without user
        return next();
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
        // Malformed token, continue without user
        return next();
    }
    try {
        const decoded = jwtService.verifyToken(parts[1]);
        req.user = decoded;
    }
    catch (err) {
        // Invalid token, but don't block - just continue without user
        console.log('[OptionalAuth] Invalid token, continuing without auth');
    }
    return next();
};
exports.optionalAuth = optionalAuth;
