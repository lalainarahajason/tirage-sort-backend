"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParticipantsUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class GetParticipantsUseCase {
    constructor(participantRepository, drawRepository) {
        this.participantRepository = participantRepository;
        this.drawRepository = drawRepository;
    }
    async execute(drawId, options) {
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        return this.participantRepository.findByDrawId(drawId, options);
    }
}
exports.GetParticipantsUseCase = GetParticipantsUseCase;
