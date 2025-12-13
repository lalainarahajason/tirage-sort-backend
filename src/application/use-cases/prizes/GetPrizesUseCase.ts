import { IPrizeRepository } from '../../../domain/repositories/IPrizeRepository';
import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { AppError } from '../../../shared/errors/AppError';

export class GetPrizesUseCase {
    constructor(
        private prizeRepository: IPrizeRepository,
        private drawRepository: IDrawRepository
    ) { }

    async execute(drawId: string) {
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }

        return this.prizeRepository.findByDrawId(drawId);
    }
}
