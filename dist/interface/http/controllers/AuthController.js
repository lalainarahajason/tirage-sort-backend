"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const RegisterUseCase_1 = require("../../../application/use-cases/auth/RegisterUseCase");
const LoginUseCase_1 = require("../../../application/use-cases/auth/LoginUseCase");
const PrismaUserRepository_1 = require("../../../infrastructure/repositories/PrismaUserRepository");
const PasswordService_1 = require("../../../infrastructure/services/PasswordService");
const JwtService_1 = require("../../../infrastructure/services/JwtService");
const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
const passwordService = new PasswordService_1.PasswordService();
const jwtService = new JwtService_1.JwtService();
const registerUseCase = new RegisterUseCase_1.RegisterUseCase(userRepository, passwordService, jwtService);
const loginUseCase = new LoginUseCase_1.LoginUseCase(userRepository, passwordService, jwtService);
class AuthController {
    async register(req, res, next) {
        try {
            const result = await registerUseCase.execute(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const result = await loginUseCase.execute(req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
