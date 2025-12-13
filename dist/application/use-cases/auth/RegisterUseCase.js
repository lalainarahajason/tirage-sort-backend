"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const User_1 = require("../../../domain/entities/User");
const AppError_1 = require("../../../shared/errors/AppError");
const crypto_1 = require("crypto");
class RegisterUseCase {
    constructor(userRepository, passwordService, jwtService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }
    async execute(dto) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new AppError_1.AppError('User already exists', 400);
        }
        const hashedPassword = await this.passwordService.hash(dto.password);
        const newUser = {
            id: (0, crypto_1.randomUUID)(),
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: dto.role || User_1.UserRole.USER,
            createdAt: new Date(),
        };
        const createdUser = await this.userRepository.create(newUser);
        const token = this.jwtService.generateToken(createdUser);
        return { user: createdUser, token };
    }
}
exports.RegisterUseCase = RegisterUseCase;
