"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddParticipantUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const crypto_1 = require("crypto");
class AddParticipantUseCase {
    constructor(participantRepository, drawRepository) {
        this.participantRepository = participantRepository;
        this.drawRepository = drawRepository;
    }
    async execute(dto) {
        const draw = await this.drawRepository.findById(dto.drawId);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        const ticketNumber = `T-${new Date().getFullYear()}-${(0, crypto_1.randomUUID)().substring(0, 8).toUpperCase()}`;
        if (dto.email) {
            const existing = await this.participantRepository.findByEmail(dto.drawId, dto.email);
            if (existing) {
                throw new AppError_1.AppError('Participant with this email already exists in the draw', 409);
            }
        }
        const newParticipant = {
            id: (0, crypto_1.randomUUID)(),
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
exports.AddParticipantUseCase = AddParticipantUseCase;
