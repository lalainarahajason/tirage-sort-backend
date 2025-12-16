import { IDrawRepository } from '../../domain/repositories/IDrawRepository';
import { Draw, DrawSettings, DrawStatus, DrawVisibility } from '../../domain/entities/Draw';
import { prisma } from '../database/prismaClient';

export class PrismaDrawRepository implements IDrawRepository {
    async create(draw: Draw): Promise<Draw> {
        const created = await prisma.draw.create({
            data: {
                id: draw.id,
                userId: draw.userId,
                title: draw.title,
                description: draw.description,
                status: draw.status,
                visibility: draw.visibility,
                shareToken: draw.shareToken,
                scheduledAt: draw.scheduledAt,
                settings: draw.settings as any, // Cast to any to satisfy Prisma Json input
            },
        });
        return this.mapToDomain(created);
    }

    async findById(id: string): Promise<Draw | null> {
        const found = await prisma.draw.findUnique({
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

    async findByShortCode(shortCode: string): Promise<Draw | null> {
        const found = await prisma.draw.findUnique({
            where: { shortCode },
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

    async findAll(userId: string): Promise<Draw[]> {
        const found = await prisma.draw.findMany({
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

    async update(id: string, draw: Partial<Draw>): Promise<Draw> {
        const updated = await prisma.draw.update({
            where: { id },
            data: {
                ...draw,
                settings: draw.settings ? (draw.settings as any) : undefined,
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

    async delete(id: string): Promise<void> {
        await prisma.draw.delete({
            where: { id },
        });
    }

    private mapToDomain(prismaDraw: any): Draw {
        return {
            id: prismaDraw.id,
            userId: prismaDraw.userId,
            title: prismaDraw.title,
            description: prismaDraw.description,
            status: prismaDraw.status as DrawStatus,
            visibility: prismaDraw.visibility as DrawVisibility,
            shareToken: prismaDraw.shareToken,
            shortCode: prismaDraw.shortCode,
            scheduledAt: prismaDraw.scheduledAt,
            settings: prismaDraw.settings as unknown as DrawSettings,
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
