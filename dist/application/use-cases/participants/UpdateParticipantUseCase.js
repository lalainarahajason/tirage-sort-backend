"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateParticipantUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class UpdateParticipantUseCase {
    constructor(participantRepository) {
        this.participantRepository = participantRepository;
    }
    async execute(id, data) {
        const existing = await this.participantRepository.findById(id);
        if (!existing) {
            throw new AppError_1.AppError('Participant not found', 404);
        }
        return this.participantRepository.update(id, data);
    }
}
exports.UpdateParticipantUseCase = UpdateParticipantUseCase;
