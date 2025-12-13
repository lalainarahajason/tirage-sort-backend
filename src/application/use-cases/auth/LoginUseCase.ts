import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { PasswordService } from '../../../infrastructure/services/PasswordService';
import { JwtService } from '../../../infrastructure/services/JwtService';
import { AppError } from '../../../shared/errors/AppError';

export class LoginUseCase {
    constructor(
        private userRepository: IUserRepository,
        private passwordService: PasswordService,
        private jwtService: JwtService
    ) { }

    async execute(dto: { email: string; password: string }) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Since we're using Prisma, user.password is available (checked logic in Repo).
        // Domain User interface has optional password, need check.
        if (!user.password) {
            throw new AppError('Invalid credentials', 401); // Possible if user created via social auth etc, but here simple.
        }

        const isMatch = await this.passwordService.compare(dto.password, user.password);
        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = this.jwtService.generateToken(user);

        return { user, token };
    }
}
