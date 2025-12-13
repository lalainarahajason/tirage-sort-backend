"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class LoginUseCase {
    constructor(userRepository, passwordService, jwtService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }
    async execute(dto) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new AppError_1.AppError('Invalid credentials', 401);
        }
        // Since we're using Prisma, user.password is available (checked logic in Repo).
        // Domain User interface has optional password, need check.
        if (!user.password) {
            throw new AppError_1.AppError('Invalid credentials', 401); // Possible if user created via social auth etc, but here simple.
        }
        const isMatch = await this.passwordService.compare(dto.password, user.password);
        if (!isMatch) {
            throw new AppError_1.AppError('Invalid credentials', 401);
        }
        const token = this.jwtService.generateToken(user);
        return { user, token };
    }
}
exports.LoginUseCase = LoginUseCase;
