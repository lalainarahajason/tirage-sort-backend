"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaWinnerRepository = void 0;
const prismaClient_1 = require("../database/prismaClient");
class PrismaWinnerRepository {
    async create(winner) {
        const created = await prismaClient_1.prisma.winner.create({
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
    async createMany(winners) {
        const result = await prismaClient_1.prisma.winner.createMany({
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
    async findByDrawId(drawId) {
        const winners = await prismaClient_1.prisma.winner.findMany({
            where: { drawId },
            orderBy: { wonAt: 'asc' },
        });
        return winners.map(this.mapToDomain);
    }
    async deleteAllByDrawId(drawId) {
        await prismaClient_1.prisma.winner.deleteMany({ where: { drawId } });
    }
    mapToDomain(w) {
        return {
            id: w.id,
            drawId: w.drawId,
            participantId: w.participantId,
            prizeId: w.prizeId,
            wonAt: w.wonAt,
        };
    }
}
exports.PrismaWinnerRepository = PrismaWinnerRepository;
