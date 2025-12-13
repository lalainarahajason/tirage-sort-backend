"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportParticipantsUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const crypto_1 = require("crypto");
class ImportParticipantsUseCase {
    constructor(participantRepository, drawRepository) {
        this.participantRepository = participantRepository;
        this.drawRepository = drawRepository;
    }
    async execute(drawId, participantsData) {
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        const batchId = (0, crypto_1.randomUUID)();
        const participantsToCreate = participantsData.map((p) => ({
            id: (0, crypto_1.randomUUID)(),
            drawId,
            name: p.name,
            email: p.email || null,
            category: p.category || 'STANDARD',
            ticketCount: p.ticketCount || 1,
            ticketNumber: `T-${new Date().getFullYear()}-${(0, crypto_1.randomUUID)().substring(0, 8).toUpperCase()}`,
            importBatchId: batchId,
        }));
        const count = await this.participantRepository.createMany(participantsToCreate);
        return { count, batchId };
    }
}
exports.ImportParticipantsUseCase = ImportParticipantsUseCase;
