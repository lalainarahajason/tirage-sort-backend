import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/User';

export class JwtService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'default-secret-do-not-use-in-prod';
        this.expiresIn = '1d';
    }

    generateToken(user: User): string {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            this.secret,
            { expiresIn: this.expiresIn as any }
        );
    }

    verifyToken(token: string): any {
        return jwt.verify(token, this.secret);
    }
}
