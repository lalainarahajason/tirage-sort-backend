import { IPrizeRepository } from '../../domain/repositories/IPrizeRepository';
import { Prize } from '../../domain/entities/Prize';
import { prisma } from '../database/prismaClient';

export class PrismaPrizeRepository implements IPrizeRepository {
    async create(prize: Prize): Promise<Prize> {
        const created = await prisma.prize.create({
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

    async findByDrawId(drawId: string): Promise<Prize[]> {
        const found = await prisma.prize.findMany({
            where: { drawId },
            orderBy: { displayOrder: 'asc' },
        });
        return found.map(this.mapToDomain);
    }

    async findById(id: string): Promise<Prize | null> {
        const found = await prisma.prize.findUnique({
            where: { id },
        });
        return found ? this.mapToDomain(found) : null;
    }

    async update(id: string, prize: Partial<Prize>): Promise<Prize> {
        const updated = await prisma.prize.update({
            where: { id },
            data: prize,
        });
        return this.mapToDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await prisma.prize.delete({ where: { id } });
    }

    private mapToDomain(p: any): Prize {
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
