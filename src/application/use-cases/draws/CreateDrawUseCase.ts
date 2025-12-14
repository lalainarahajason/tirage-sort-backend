import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { Draw, DrawStatus, DrawSettings } from '../../../domain/entities/Draw';
import { randomUUID } from 'crypto';

export class CreateDrawUseCase {
    constructor(private drawRepository: IDrawRepository) { }

    async execute(userId: string, dto: {
        title: string;
        description?: string;
        settings: DrawSettings;
        scheduledAt?: string; // Expects ISO string or date
    }) {
        const newDraw: Draw = {
            id: randomUUID(),
            userId,
            title: dto.title,
            description: dto.description || null,
            status: DrawStatus.DRAFT,
            scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
            settings: dto.settings,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return this.drawRepository.create(newDraw);
    }
}
