"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteDrawUseCase = void 0;
const crypto_1 = require("crypto");
const Draw_1 = require("../../../domain/entities/Draw");
const AppError_1 = require("../../../shared/errors/AppError");
class ExecuteDrawUseCase {
    constructor(drawRepository, participantRepository, prizeRepository, winnerRepository) {
        this.drawRepository = drawRepository;
        this.participantRepository = participantRepository;
        this.prizeRepository = prizeRepository;
        this.winnerRepository = winnerRepository;
    }
    async execute(drawId) {
        // Get the draw
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        // Check if already completed
        if (draw.status === Draw_1.DrawStatus.COMPLETED) {
            return { drawId, winnersCount: 0, status: Draw_1.DrawStatus.COMPLETED };
        }
        // Mark as IN_PROGRESS
        await this.drawRepository.update(drawId, { status: Draw_1.DrawStatus.IN_PROGRESS });
        try {
            // Get all participants and prizes
            const participants = await this.participantRepository.findAllByDrawId(drawId);
            const prizes = await this.prizeRepository.findByDrawId(drawId);
            if (participants.length === 0) {
                // No participants, mark as completed
                await this.drawRepository.update(drawId, { status: Draw_1.DrawStatus.COMPLETED });
                return { drawId, winnersCount: 0, status: Draw_1.DrawStatus.COMPLETED };
            }
            // Delete existing winners (if re-executing)
            await this.winnerRepository.deleteAllByDrawId(drawId);
            // Select winners
            const winners = [];
            const usedParticipantIds = new Set();
            for (const prize of prizes) {
                // For each prize quantity, select a winner
                for (let i = 0; i < prize.quantity; i++) {
                    const winner = this.selectRandomWinner(participants, usedParticipantIds, draw.settings.mode === 'NO_REPLACEMENT');
                    if (winner) {
                        winners.push({
                            id: (0, crypto_1.randomUUID)(),
                            drawId,
                            participantId: winner.id,
                            prizeId: prize.id,
                            wonAt: new Date(),
                        });
                        if (draw.settings.mode === 'NO_REPLACEMENT') {
                            usedParticipantIds.add(winner.id);
                        }
                    }
                }
            }
            // Create winners in batch
            if (winners.length > 0) {
                await this.winnerRepository.createMany(winners);
            }
            // Mark as COMPLETED
            await this.drawRepository.update(drawId, { status: Draw_1.DrawStatus.COMPLETED });
            return { drawId, winnersCount: winners.length, status: Draw_1.DrawStatus.COMPLETED };
        }
        catch (error) {
            // Rollback to READY on error
            await this.drawRepository.update(drawId, { status: Draw_1.DrawStatus.READY });
            throw error;
        }
    }
    selectRandomWinner(participants, usedIds, noReplacement) {
        // Build pool of available participants
        let pool = participants;
        if (noReplacement) {
            pool = participants.filter((p) => !usedIds.has(p.id));
        }
        if (pool.length === 0) {
            return null;
        }
        // Weighted random selection based on ticketCount
        const weightedPool = [];
        for (const p of pool) {
            for (let i = 0; i < (p.ticketCount || 1); i++) {
                weightedPool.push(p);
            }
        }
        const randomIndex = Math.floor(Math.random() * weightedPool.length);
        return weightedPool[randomIndex];
    }
}
exports.ExecuteDrawUseCase = ExecuteDrawUseCase;
