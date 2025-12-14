import { IParticipantRepository } from '../../../domain/repositories/IParticipantRepository';
import { Participant } from '../../../domain/entities/Participant';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateParticipantUseCase {
    constructor(private participantRepository: IParticipantRepository) { }

    async execute(id: string, data: Partial<Participant>): Promise<Participant> {
        const existing = await this.participantRepository.findById(id);
        if (!existing) {
            throw new AppError('Participant not found', 404);
        }

        return this.participantRepository.update(id, data);
    }
}
