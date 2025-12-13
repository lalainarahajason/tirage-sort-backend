import { IParticipantRepository } from '../../../domain/repositories/IParticipantRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeleteParticipantUseCase {
    constructor(private participantRepository: IParticipantRepository) { }

    async execute(id: string): Promise<void> {
        const exists = await this.participantRepository.findById(id);
        if (!exists) {
            throw new AppError('Participant not found', 404);
        }
        await this.participantRepository.delete(id);
    }
}
