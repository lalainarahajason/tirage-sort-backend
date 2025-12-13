"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteParticipantUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class DeleteParticipantUseCase {
    constructor(participantRepository) {
        this.participantRepository = participantRepository;
    }
    async execute(id) {
        const exists = await this.participantRepository.findById(id);
        if (!exists) {
            throw new AppError_1.AppError('Participant not found', 404);
        }
        await this.participantRepository.delete(id);
    }
}
exports.DeleteParticipantUseCase = DeleteParticipantUseCase;
