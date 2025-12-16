import {
    IParticipantRepository,
    PaginationOptions,
    PaginatedResult,
} from '../../domain/repositories/IParticipantRepository';
import { Participant } from '../../domain/entities/Participant';
import { prisma } from '../database/prismaClient';

export class PrismaParticipantRepository implements IParticipantRepository {
    async create(participant: Participant): Promise<Participant> {
        const created = await prisma.participant.create({
            data: {
                id: participant.id,
                drawId: participant.drawId,
                name: participant.name,
                email: participant.email,
                category: participant.category,
                ticketCount: participant.ticketCount,
                ticketNumber: participant.ticketNumber,
                importBatchId: participant.importBatchId,
            },
        });
        return this.mapToDomain(created);
    }

    async createMany(participants: Participant[]): Promise<number> {
        const result = await prisma.participant.createMany({
            data: participants.map((p) => ({
                id: p.id,
                drawId: p.drawId,
                name: p.name,
                email: p.email,
                category: p.category,
                ticketCount: p.ticketCount,
                ticketNumber: p.ticketNumber,
                importBatchId: p.importBatchId,
            })),
            skipDuplicates: true, // Optional safety
        });
        return result.count;
    }

    async findByDrawId(
        drawId: string,
        options?: PaginationOptions
    ): Promise<PaginatedResult<Participant>> {
        const { page, limit } = options || { page: 1, limit: 10 };
        const skip = (page - 1) * limit;

        const [total, data] = await Promise.all([
            prisma.participant.count({ where: { drawId } }),
            prisma.participant.findMany({
                where: { drawId },
                skip,
                take: limit,
                orderBy: { name: 'asc' }, // Basic sorting
            }),
        ]);

        return {
            data: data.map(this.mapToDomain),
            total,
        };
    }

    async findAllByDrawId(drawId: string): Promise<Participant[]> {
        const found = await prisma.participant.findMany({
            where: { drawId },
            orderBy: { name: 'asc' },
        });
        return found.map(this.mapToDomain);
    }

    async findById(id: string): Promise<Participant | null> {
        const found = await prisma.participant.findUnique({
            where: { id },
        });
        return found ? this.mapToDomain(found) : null;
    }

    async update(id: string, data: Partial<Participant>): Promise<Participant> {
        const updated = await prisma.participant.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                category: data.category,
                ticketCount: data.ticketCount,
            },
        });
        return this.mapToDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await prisma.participant.delete({ where: { id } });
    }

    async deleteAllByDrawId(drawId: string): Promise<void> {
        await prisma.participant.deleteMany({ where: { drawId } });
    }

    async countByDrawId(drawId: string): Promise<number> {
        return prisma.participant.count({ where: { drawId } });
    }

    async findDistinctByUserId(userId: string): Promise<Participant[]> {
        const found = await prisma.participant.findMany({
            where: {
                draw: { userId },
            },
            distinct: ['email', 'name'],
            orderBy: { name: 'asc' },
            take: 100, // Limit to 100 most recent/relevant to avoid huge payloads
        });
        return found.map(this.mapToDomain);
    }

    private mapToDomain(p: any): Participant {
        return {
            id: p.id,
            drawId: p.drawId,
            name: p.name,
            email: p.email,
            category: p.category,
            ticketCount: p.ticketCount,
            ticketNumber: p.ticketNumber,
            importBatchId: p.importBatchId,
        };
    }
}
