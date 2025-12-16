import { randomUUID } from 'crypto';
import { IDrawRepository } from '../../domain/repositories/IDrawRepository';
import { DrawVisibility } from '../../domain/entities/Draw';

export class GenerateShareToken {
    constructor(private drawRepository: IDrawRepository) { }

    async execute(drawId: string, userId: string): Promise<string> {
        const draw = await this.drawRepository.findById(drawId);

        if (!draw) {
            throw new Error('Draw not found');
        }

        if (draw.userId !== userId) {
            throw new Error('Unauthorized');
        }

        // Generate a unique token using native Node.js crypto
        const shareToken = randomUUID();

        // Update the draw with SHARED visibility and the new token
        await this.drawRepository.update(drawId, {
            visibility: DrawVisibility.SHARED,
            shareToken
        });

        return shareToken;
    }
}
