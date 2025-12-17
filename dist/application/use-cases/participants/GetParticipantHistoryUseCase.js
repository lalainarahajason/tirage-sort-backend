"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParticipantHistoryUseCase = void 0;
class GetParticipantHistoryUseCase {
    constructor(participantRepository) {
        this.participantRepository = participantRepository;
    }
    async execute(userId, excludeDrawId) {
        return this.participantRepository.findDistinctByUserId(userId, excludeDrawId);
    }
}
exports.GetParticipantHistoryUseCase = GetParticipantHistoryUseCase;
