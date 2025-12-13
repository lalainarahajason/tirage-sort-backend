import { IPrizeRepository } from '../../../domain/repositories/IPrizeRepository';
import { Prize } from '../../../domain/entities/Prize';
import { AppError } from '../../../shared/errors/AppError';

export class UpdatePrizeUseCase {
    constructor(private prizeRepository: IPrizeRepository) { }

    async execute(id: string, updates: Partial<Prize>) {
        const prize = await this.prizeRepository.findById(id);
        if (!prize) {
            throw new AppError('Prize not found', 404);
        }
        return this.prizeRepository.update(id, updates);
    }
}
