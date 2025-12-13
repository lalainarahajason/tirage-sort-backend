"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const prismaClient_1 = require("../database/prismaClient");
class PrismaUserRepository {
    async create(user) {
        const created = await prismaClient_1.prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                password: user.password, // Assume hash is passed
                role: user.role,
                // createdAt is handled by default in DB but we can pass it if we want strict consistency
            },
        });
        return this.mapToDomain(created);
    }
    async findByEmail(email) {
        const found = await prismaClient_1.prisma.user.findUnique({
            where: { email },
        });
        return found ? this.mapToDomain(found) : null;
    }
    async findById(id) {
        const found = await prismaClient_1.prisma.user.findUnique({
            where: { id },
        });
        return found ? this.mapToDomain(found) : null;
    }
    mapToDomain(prismaUser) {
        return {
            id: prismaUser.id,
            email: prismaUser.email,
            password: prismaUser.password, // We might exclude this in some layers but Repo returns full entity
            name: prismaUser.name,
            role: prismaUser.role,
            createdAt: prismaUser.createdAt,
        };
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
