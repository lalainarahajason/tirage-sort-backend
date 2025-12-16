import { IParticipantRepository } from '../../../domain/repositories/IParticipantRepository';
import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { Participant } from '../../../domain/entities/Participant';
import { AppError } from '../../../shared/errors/AppError';
import { randomUUID } from 'crypto';

export class AddParticipantUseCase {
    constructor(
        private participantRepository: IParticipantRepository,
        private drawRepository: IDrawRepository
    ) { }

    async execute(dto: {
        drawId: string;
        name: string;
        email?: string;
        category?: string;
        ticketCount?: number;
    }) {
        const draw = await this.drawRepository.findById(dto.drawId);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }

        const ticketNumber = `T-${new Date().getFullYear()}-${randomUUID().substring(0, 8).toUpperCase()}`;

        if (dto.email) {
            const existing = await this.participantRepository.findByEmail(dto.drawId, dto.email);
            if (existing) {
                throw new AppError('Participant with this email already exists in the draw', 409);
            }
        }

        const newParticipant: Participant = {
            id: randomUUID(),
            drawId: dto.drawId,
            name: dto.name,
            email: dto.email || null,
            category: dto.category || 'STANDARD',
            ticketCount: dto.ticketCount || 1,
            ticketNumber,
            importBatchId: null,
        };

        return this.participantRepository.create(newParticipant);
    }
}
