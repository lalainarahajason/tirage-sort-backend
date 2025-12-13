import { IParticipantRepository } from '../../../domain/repositories/IParticipantRepository';
import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { AppError } from '../../../shared/errors/AppError';

export class ClearParticipantsUseCase {
    constructor(
        private participantRepository: IParticipantRepository,
        private drawRepository: IDrawRepository
    ) { }

    async execute(drawId: string): Promise<void> {
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }
        await this.participantRepository.deleteAllByDrawId(drawId);
    }
}
