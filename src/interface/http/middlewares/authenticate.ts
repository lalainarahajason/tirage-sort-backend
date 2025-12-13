import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../../infrastructure/services/JwtService';
import { AppError } from '../../../shared/errors/AppError';

// Augment express request
declare global {
    namespace Express {
        interface Request {
            user?: any; // Ideally typed User
        }
    }
}

const jwtService = new JwtService();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // DEBUG LOG
    console.log(`[AuthMiddleware] Checking ${req.method} ${req.originalUrl}`);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new AppError('No token provided', 401));
    }

    const parts = authHeader.split(' ');

    if (!parts.length || parts.length !== 2) {
        return next(new AppError('Token error', 401));
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return next(new AppError('Token malformed', 401));
    }

    try {
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
        return next();
    } catch (err) {
        return next(new AppError('Token invalid', 401));
    }
};
