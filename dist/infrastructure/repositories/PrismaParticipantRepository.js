"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaParticipantRepository = void 0;
const prismaClient_1 = require("../database/prismaClient");
class PrismaParticipantRepository {
    async create(participant) {
        const created = await prismaClient_1.prisma.participant.create({
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
    async createMany(participants) {
        const result = await prismaClient_1.prisma.participant.createMany({
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
    async findByDrawId(drawId, options) {
        const { page, limit } = options || { page: 1, limit: 10 };
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            prismaClient_1.prisma.participant.count({ where: { drawId } }),
            prismaClient_1.prisma.participant.findMany({
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
    async findById(id) {
        const found = await prismaClient_1.prisma.participant.findUnique({
            where: { id },
        });
        return found ? this.mapToDomain(found) : null;
    }
    async update(id, data) {
        const updated = await prismaClient_1.prisma.participant.update({
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
    async delete(id) {
        await prismaClient_1.prisma.participant.delete({ where: { id } });
    }
    async deleteAllByDrawId(drawId) {
        await prismaClient_1.prisma.participant.deleteMany({ where: { drawId } });
    }
    async countByDrawId(drawId) {
        return prismaClient_1.prisma.participant.count({ where: { drawId } });
    }
    mapToDomain(p) {
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
exports.PrismaParticipantRepository = PrismaParticipantRepository;
