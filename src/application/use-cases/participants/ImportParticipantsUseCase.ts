import { IParticipantRepository } from '../../../domain/repositories/IParticipantRepository';
import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { Participant } from '../../../domain/entities/Participant';
import { AppError } from '../../../shared/errors/AppError';
import { randomUUID } from 'crypto';

interface ImportParticipantDto {
    name: string;
    email?: string;
    category?: string;
    ticketCount?: number;
}

export class ImportParticipantsUseCase {
    constructor(
        private participantRepository: IParticipantRepository,
        private drawRepository: IDrawRepository
    ) { }

    async execute(drawId: string, participantsData: ImportParticipantDto[]) {
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }

        const batchId = randomUUID();
        const participantsToCreate: Participant[] = participantsData.map((p) => ({
            id: randomUUID(),
            drawId,
            name: p.name,
            email: p.email || null,
            category: p.category || 'STANDARD',
            ticketCount: p.ticketCount || 1,
            ticketNumber: `T-${new Date().getFullYear()}-${randomUUID().substring(0, 8).toUpperCase()}`,
            importBatchId: batchId,
        }));

        const count = await this.participantRepository.createMany(participantsToCreate);

        return { count, batchId };
    }
}
