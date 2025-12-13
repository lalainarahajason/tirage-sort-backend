"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearParticipantsUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class ClearParticipantsUseCase {
    constructor(participantRepository, drawRepository) {
        this.participantRepository = participantRepository;
        this.drawRepository = drawRepository;
    }
    async execute(drawId) {
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        await this.participantRepository.deleteAllByDrawId(drawId);
    }
}
exports.ClearParticipantsUseCase = ClearParticipantsUseCase;
