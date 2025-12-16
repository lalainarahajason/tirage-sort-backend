import { IWinnerRepository } from '../../domain/repositories/IWinnerRepository';
import { Winner } from '../../domain/entities/Winner';
import { prisma } from '../database/prismaClient';

export class PrismaWinnerRepository implements IWinnerRepository {
    async create(winner: Winner): Promise<Winner> {
        const created = await prisma.winner.create({
            data: {
                id: winner.id,
                drawId: winner.drawId,
                participantId: winner.participantId,
                prizeId: winner.prizeId,
                wonAt: winner.wonAt,
            },
        });
        return this.mapToDomain(created);
    }

    async createMany(winners: Winner[]): Promise<number> {
        const result = await prisma.winner.createMany({
            data: winners.map((w) => ({
                id: w.id,
                drawId: w.drawId,
                participantId: w.participantId,
                prizeId: w.prizeId,
                wonAt: w.wonAt,
            })),
            skipDuplicates: true,
        });
        return result.count;
    }

    async findByDrawId(drawId: string): Promise<Winner[]> {
        const winners = await prisma.winner.findMany({
            where: { drawId },
            orderBy: { wonAt: 'asc' },
        });
        return winners.map(this.mapToDomain);
    }

    async findByDrawIdWithDetails(drawId: string): Promise<any[]> {
        const winners = await prisma.winner.findMany({
            where: { drawId },
            include: {
                participant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        ticketNumber: true,
                    },
                },
                prize: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
            orderBy: { wonAt: 'asc' },
        });
        return winners;
    }

    async deleteAllByDrawId(drawId: string): Promise<void> {
        await prisma.winner.deleteMany({ where: { drawId } });
    }

    private mapToDomain(w: any): Winner {
        return {
            id: w.id,
            drawId: w.drawId,
            participantId: w.participantId,
            prizeId: w.prizeId,
            wonAt: w.wonAt,
        };
    }
}
