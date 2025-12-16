import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { Draw, DrawStatus } from '../../../domain/entities/Draw';
import { AppError } from '../../../shared/errors/AppError';
import { IWinnerRepository } from '../../../domain/repositories/IWinnerRepository';

export class UpdateDrawUseCase {
    constructor(
        private drawRepository: IDrawRepository,
        private winnerRepository?: IWinnerRepository
    ) { }

    async execute(id: string, updates: Partial<Draw>) {
        const draw = await this.drawRepository.findById(id);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }

        // Business logic: If rescheduling a completed draw to a future date,
        // reset status to READY and clear existing winners
        if (
            updates.scheduledAt &&
            draw.status === DrawStatus.COMPLETED &&
            new Date(updates.scheduledAt) > new Date()
        ) {
            updates.status = DrawStatus.READY;

            // Clear existing winners if we have the repository
            if (this.winnerRepository) {
                await this.winnerRepository.deleteAllByDrawId(id);
            }
        }

        return this.drawRepository.update(id, updates);
    }
}

