import { IPrizeRepository } from '../../../domain/repositories/IPrizeRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeletePrizeUseCase {
    constructor(private prizeRepository: IPrizeRepository) { }

    async execute(id: string) {
        const prize = await this.prizeRepository.findById(id);
        if (!prize) {
            throw new AppError('Prize not found', 404);
        }
        await this.prizeRepository.delete(id);
    }
}
