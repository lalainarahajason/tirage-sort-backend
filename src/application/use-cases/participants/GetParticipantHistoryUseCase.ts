import { IParticipantRepository } from '../../../domain/repositories/IParticipantRepository';
import { Participant } from '../../../domain/entities/Participant';

export class GetParticipantHistoryUseCase {
    constructor(private participantRepository: IParticipantRepository) { }

    async execute(userId: string): Promise<Participant[]> {
        return this.participantRepository.findDistinctByUserId(userId);
    }
}
