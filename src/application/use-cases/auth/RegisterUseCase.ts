
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { PasswordService } from '../../../infrastructure/services/PasswordService';
import { JwtService } from '../../../infrastructure/services/JwtService';
import { User, UserRole } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { randomUUID } from 'crypto';

export class RegisterUseCase {
    constructor(
        private userRepository: IUserRepository,
        private passwordService: PasswordService,
        private jwtService: JwtService
    ) { }

    async execute(dto: { name: string; email: string; password: string; role?: UserRole }) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new AppError('User already exists', 400);
        }

        const hashedPassword = await this.passwordService.hash(dto.password);

        const newUser: User = {
            id: randomUUID(),
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: dto.role || UserRole.USER,
            createdAt: new Date(),
        };

        const createdUser = await this.userRepository.create(newUser);
        const token = this.jwtService.generateToken(createdUser);

        return { user: createdUser, token };
    }
}
