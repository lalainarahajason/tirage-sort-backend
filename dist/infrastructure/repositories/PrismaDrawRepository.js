"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDrawRepository = void 0;
const prismaClient_1 = require("../database/prismaClient");
class PrismaDrawRepository {
    async create(draw) {
        const created = await prismaClient_1.prisma.draw.create({
            data: {
                id: draw.id,
                userId: draw.userId,
                title: draw.title,
                description: draw.description,
                status: draw.status,
                visibility: draw.visibility,
                shareToken: draw.shareToken,
                scheduledAt: draw.scheduledAt,
                settings: draw.settings, // Cast to any to satisfy Prisma Json input
            },
        });
        return this.mapToDomain(created);
    }
    async findById(id) {
        const found = await prismaClient_1.prisma.draw.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        participants: true,
                        winners: true,
                        prizes: true,
                    },
                },
            },
        });
        return found ? this.mapToDomain(found) : null;
    }
    async findAll(userId) {
        const found = await prismaClient_1.prisma.draw.findMany({
            where: { userId },
            include: {
                _count: {
                    select: {
                        participants: true,
                        winners: true,
                        prizes: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return found.map(this.mapToDomain);
    }
    async update(id, draw) {
        const updated = await prismaClient_1.prisma.draw.update({
            where: { id },
            data: {
                ...draw,
                settings: draw.settings ? draw.settings : undefined,
            },
            include: {
                _count: {
                    select: {
                        participants: true,
                        winners: true,
                        prizes: true,
                    },
                },
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
            userId: prismaDraw.userId,
            title: prismaDraw.title,
            description: prismaDraw.description,
            status: prismaDraw.status,
            visibility: prismaDraw.visibility,
            shareToken: prismaDraw.shareToken,
            scheduledAt: prismaDraw.scheduledAt,
            settings: prismaDraw.settings,
            createdAt: prismaDraw.createdAt,
            updatedAt: prismaDraw.updatedAt,
            _count: prismaDraw._count ? {
                participants: prismaDraw._count.participants,
                winners: prismaDraw._count.winners,
                prizes: prismaDraw._count.prizes,
            } : undefined,
        };
    }
}
exports.PrismaDrawRepository = PrismaDrawRepository;
