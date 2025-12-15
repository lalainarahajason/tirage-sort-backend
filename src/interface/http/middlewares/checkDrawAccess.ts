import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../../infrastructure/services/JwtService';
import { AppError } from '../../../shared/errors/AppError';
import { prisma } from '../../../infrastructure/database/prismaClient';

const jwtService = new JwtService();

/**
 * Middleware to check draw access based on visibility level
 * - PUBLIC: Anyone can access
 * - SHARED: Requires valid shareToken in query params OR owner authentication
 * - PRIVATE: Requires owner authentication only
 */
export const checkDrawAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const drawId = req.params.id || req.params.drawId;
        const shareToken = req.query.shareToken as string | undefined;

        // 1. Fetch the draw to check visibility
        const draw = await prisma.draw.findUnique({
            where: { id: drawId },
            select: {
                id: true,
                visibility: true,
                shareToken: true,
                userId: true
            }
        });

        if (!draw) {
            return next(new AppError('Draw not found', 404));
        }

        console.log('[checkDrawAccess] Draw:', {
            id: draw.id,
            visibility: draw.visibility,
            hasShareToken: !!draw.shareToken,
            shareTokenLength: draw.shareToken?.length
        });
        console.log('[checkDrawAccess] Request:', {
            shareTokenParam: shareToken,
            shareTokenMatch: shareToken === draw.shareToken
        });

        // 2. PUBLIC draws are accessible to everyone
        if (draw.visibility === 'PUBLIC') {
            return next();
        }

        // 3. SHARED draws require valid shareToken OR owner authentication
        if (draw.visibility === 'SHARED') {
            if (shareToken && shareToken === draw.shareToken) {
                console.log('[checkDrawAccess] ✅ Valid shareToken, granting access');
                return next(); // Valid share token
            }
            console.log('[checkDrawAccess] ❌ No valid shareToken, checking auth');
            // No token or invalid token → check if owner
        }

        // 4. PRIVATE draws OR SHARED without valid token → verify owner
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(new AppError('Access denied', 403));
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
            return next(new AppError('Token malformed', 401));
        }

        try {
            const decoded = jwtService.verifyToken(parts[1]);
            req.user = decoded;

            // Verify ownership
            if (decoded.id !== draw.userId) {
                return next(new AppError('Access denied', 403));
            }

            return next();
        } catch (_err) {
            return next(new AppError('Token invalid', 401));
        }
    } catch (error) {
        return next(error);
    }
};
