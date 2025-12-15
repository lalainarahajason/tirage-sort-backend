"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDrawAccess = void 0;
const JwtService_1 = require("../../../infrastructure/services/JwtService");
const AppError_1 = require("../../../shared/errors/AppError");
const prismaClient_1 = require("../../../infrastructure/database/prismaClient");
const jwtService = new JwtService_1.JwtService();
/**
 * Middleware to check draw access based on visibility level
 * - PUBLIC: Anyone can access
 * - SHARED: Requires valid shareToken in query params OR owner authentication
 * - PRIVATE: Requires owner authentication only
 */
const checkDrawAccess = async (req, res, next) => {
    try {
        const drawId = req.params.id;
        const shareToken = req.query.shareToken;
        // 1. Fetch the draw to check visibility
        const draw = await prismaClient_1.prisma.draw.findUnique({
            where: { id: drawId },
            select: {
                id: true,
                visibility: true,
                shareToken: true,
                userId: true
            }
        });
        if (!draw) {
            return next(new AppError_1.AppError('Draw not found', 404));
        }
        // 2. PUBLIC draws are accessible to everyone
        if (draw.visibility === 'PUBLIC') {
            return next();
        }
        // 3. SHARED draws require valid shareToken OR owner authentication
        if (draw.visibility === 'SHARED') {
            if (shareToken && shareToken === draw.shareToken) {
                return next(); // Valid share token
            }
            // No token or invalid token → check if owner
        }
        // 4. PRIVATE draws OR SHARED without valid token → verify owner
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new AppError_1.AppError('Access denied', 403));
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
            return next(new AppError_1.AppError('Token malformed', 401));
        }
        try {
            const decoded = jwtService.verifyToken(parts[1]);
            req.user = decoded;
            // Verify ownership
            if (decoded.id !== draw.userId) {
                return next(new AppError_1.AppError('Access denied', 403));
            }
            return next();
        }
        catch (err) {
            return next(new AppError_1.AppError('Token invalid', 401));
        }
    }
    catch (error) {
        return next(error);
    }
};
exports.checkDrawAccess = checkDrawAccess;
