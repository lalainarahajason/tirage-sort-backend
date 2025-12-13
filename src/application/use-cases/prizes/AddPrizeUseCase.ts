import { IPrizeRepository } from '../../../domain/repositories/IPrizeRepository';
import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { Prize } from '../../../domain/entities/Prize';
import { AppError } from '../../../shared/errors/AppError';
import { randomUUID } from 'crypto';

export class AddPrizeUseCase {
    constructor(
        private prizeRepository: IPrizeRepository,
        private drawRepository: IDrawRepository
    ) { }

    async execute(dto: {
        drawId: string;
        name: string;
        description?: string;
        quantity: number;
        category?: string;
        imageUrl?: string;
        displayOrder?: number;
    }) {
        const draw = await this.drawRepository.findById(dto.drawId);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }

        const newPrize: Prize = {
            id: randomUUID(),
            drawId: dto.drawId,
            name: dto.name,
            description: dto.description || null,
            quantity: dto.quantity,
            category: dto.category || null,
            imageUrl: dto.imageUrl || null,
            displayOrder: dto.displayOrder || 0, // Should logically find max order and increment, but simple 0 for now
        };

        return this.prizeRepository.create(newPrize);
    }
}
