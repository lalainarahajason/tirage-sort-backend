import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase';
import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository';
import { PasswordService } from '../../../infrastructure/services/PasswordService';
import { JwtService } from '../../../infrastructure/services/JwtService';

const userRepository = new PrismaUserRepository();
const passwordService = new PasswordService();
const jwtService = new JwtService();

const registerUseCase = new RegisterUseCase(userRepository, passwordService, jwtService);
const loginUseCase = new LoginUseCase(userRepository, passwordService, jwtService);

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await registerUseCase.execute(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await loginUseCase.execute(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
