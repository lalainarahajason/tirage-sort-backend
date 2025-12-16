"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDrawUseCase = void 0;
const Draw_1 = require("../../../domain/entities/Draw");
const AppError_1 = require("../../../shared/errors/AppError");
class UpdateDrawUseCase {
    constructor(drawRepository, winnerRepository) {
        this.drawRepository = drawRepository;
        this.winnerRepository = winnerRepository;
    }
    async execute(id, updates) {
        const draw = await this.drawRepository.findById(id);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        // Business logic: If rescheduling a completed draw to a future date,
        // reset status to READY and clear existing winners
        if (updates.scheduledAt &&
            draw.status === Draw_1.DrawStatus.COMPLETED &&
            new Date(updates.scheduledAt) > new Date()) {
            updates.status = Draw_1.DrawStatus.READY;
            // Clear existing winners if we have the repository
            if (this.winnerRepository) {
                await this.winnerRepository.deleteAllByDrawId(id);
            }
        }
        return this.drawRepository.update(id, updates);
    }
}
exports.UpdateDrawUseCase = UpdateDrawUseCase;
