"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPrizeRepository = void 0;
const prismaClient_1 = require("../database/prismaClient");
class PrismaPrizeRepository {
    async create(prize) {
        const created = await prismaClient_1.prisma.prize.create({
            data: {
                id: prize.id,
                drawId: prize.drawId,
                name: prize.name,
                description: prize.description,
                quantity: prize.quantity,
                category: prize.category,
                imageUrl: prize.imageUrl,
                displayOrder: prize.displayOrder,
            },
        });
        return this.mapToDomain(created);
    }
    async findByDrawId(drawId) {
        const found = await prismaClient_1.prisma.prize.findMany({
            where: { drawId },
            orderBy: { displayOrder: 'asc' },
        });
        return found.map(this.mapToDomain);
    }
    async findById(id) {
        const found = await prismaClient_1.prisma.prize.findUnique({
            where: { id },
        });
        return found ? this.mapToDomain(found) : null;
    }
    async update(id, prize) {
        const updated = await prismaClient_1.prisma.prize.update({
            where: { id },
            data: prize,
        });
        return this.mapToDomain(updated);
    }
    async delete(id) {
        await prismaClient_1.prisma.prize.delete({ where: { id } });
    }
    mapToDomain(p) {
        return {
            id: p.id,
            drawId: p.drawId,
            name: p.name,
            description: p.description,
            quantity: p.quantity,
            category: p.category,
            imageUrl: p.imageUrl,
            displayOrder: p.displayOrder,
        };
    }
}
exports.PrismaPrizeRepository = PrismaPrizeRepository;
