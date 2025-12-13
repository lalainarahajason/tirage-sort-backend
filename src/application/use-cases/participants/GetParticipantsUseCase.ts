import { IParticipantRepository, PaginationOptions } from '../../../domain/repositories/IParticipantRepository';
import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { AppError } from '../../../shared/errors/AppError';

export class GetParticipantsUseCase {
    constructor(
        private participantRepository: IParticipantRepository,
        private drawRepository: IDrawRepository
    ) { }

    async execute(drawId: string, options: PaginationOptions) {
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }

        return this.participantRepository.findByDrawId(drawId, options);
    }
}
