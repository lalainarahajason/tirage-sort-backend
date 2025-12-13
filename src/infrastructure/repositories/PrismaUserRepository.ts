import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, UserRole } from '../../domain/entities/User';
import { prisma } from '../database/prismaClient';

export class PrismaUserRepository implements IUserRepository {
    async create(user: User): Promise<User> {
        const created = await prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                password: user.password!, // Assume hash is passed
                role: user.role,
                // createdAt is handled by default in DB but we can pass it if we want strict consistency
            },
        });
        return this.mapToDomain(created);
    }

    async findByEmail(email: string): Promise<User | null> {
        const found = await prisma.user.findUnique({
            where: { email },
        });
        return found ? this.mapToDomain(found) : null;
    }

    async findById(id: string): Promise<User | null> {
        const found = await prisma.user.findUnique({
            where: { id },
        });
        return found ? this.mapToDomain(found) : null;
    }

    private mapToDomain(prismaUser: any): User {
        return {
            id: prismaUser.id,
            email: prismaUser.email,
            password: prismaUser.password, // We might exclude this in some layers but Repo returns full entity
            name: prismaUser.name,
            role: prismaUser.role as UserRole,
            createdAt: prismaUser.createdAt,
        };
    }
}
