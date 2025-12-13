"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDrawRepository = void 0;
const prismaClient_1 = require("../database/prismaClient");
class PrismaDrawRepository {
    async create(draw) {
        const created = await prismaClient_1.prisma.draw.create({
            data: {
                id: draw.id,
                title: draw.title,
                description: draw.description,
                status: draw.status,
                scheduledAt: draw.scheduledAt,
                settings: draw.settings, // Cast to any to satisfy Prisma Json input
            },
        });
        return this.mapToDomain(created);
    }
    async findById(id) {
        const found = await prismaClient_1.prisma.draw.findUnique({
            where: { id },
        });
        return found ? this.mapToDomain(found) : null;
    }
    async findAll() {
        const found = await prismaClient_1.prisma.draw.findMany();
        return found.map(this.mapToDomain);
    }
    async update(id, draw) {
        const updated = await prismaClient_1.prisma.draw.update({
            where: { id },
            data: {
                ...draw,
                settings: draw.settings ? draw.settings : undefined,
            },
        });
        return this.mapToDomain(updated);
    }
    async delete(id) {
        await prismaClient_1.prisma.draw.delete({
            where: { id },
        });
    }
    mapToDomain(prismaDraw) {
        return {
            id: prismaDraw.id,
            title: prismaDraw.title,
            description: prismaDraw.description,
            status: prismaDraw.status,
            scheduledAt: prismaDraw.scheduledAt,
            settings: prismaDraw.settings,
            createdAt: prismaDraw.createdAt,
            updatedAt: prismaDraw.updatedAt,
        };
    }
}
exports.PrismaDrawRepository = PrismaDrawRepository;
