import { randomUUID } from 'crypto';
import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { IParticipantRepository } from '../../../domain/repositories/IParticipantRepository';
import { IPrizeRepository } from '../../../domain/repositories/IPrizeRepository';
import { IWinnerRepository } from '../../../domain/repositories/IWinnerRepository';
import { DrawStatus } from '../../../domain/entities/Draw';
import { Winner } from '../../../domain/entities/Winner';
import { Participant } from '../../../domain/entities/Participant';
import { AppError } from '../../../shared/errors/AppError';

export interface ExecuteDrawResult {
    drawId: string;
    winnersCount: number;
    status: DrawStatus;
}

export class ExecuteDrawUseCase {
    constructor(
        private drawRepository: IDrawRepository,
        private participantRepository: IParticipantRepository,
        private prizeRepository: IPrizeRepository,
        private winnerRepository: IWinnerRepository
    ) { }

    async execute(drawId: string): Promise<ExecuteDrawResult> {
        // Get the draw
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }

        // Check if already completed
        if (draw.status === DrawStatus.COMPLETED) {
            return { drawId, winnersCount: 0, status: DrawStatus.COMPLETED };
        }

        // Mark as IN_PROGRESS
        await this.drawRepository.update(drawId, { status: DrawStatus.IN_PROGRESS });

        try {
            // Get all participants and prizes
            const participants = await this.participantRepository.findAllByDrawId(drawId);
            const prizes = await this.prizeRepository.findByDrawId(drawId);

            if (participants.length === 0) {
                // No participants, mark as completed
                await this.drawRepository.update(drawId, { status: DrawStatus.COMPLETED });
                return { drawId, winnersCount: 0, status: DrawStatus.COMPLETED };
            }

            // Delete existing winners (if re-executing)
            await this.winnerRepository.deleteAllByDrawId(drawId);

            // Select winners
            const winners: Winner[] = [];
            const usedParticipantIds = new Set<string>();

            for (const prize of prizes) {
                // For each prize quantity, select a winner
                for (let i = 0; i < prize.quantity; i++) {
                    const winner = this.selectRandomWinner(
                        participants,
                        usedParticipantIds,
                        draw.settings.mode === 'NO_REPLACEMENT'
                    );

                    if (winner) {
                        winners.push({
                            id: randomUUID(),
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
            await this.drawRepository.update(drawId, { status: DrawStatus.COMPLETED });

            return { drawId, winnersCount: winners.length, status: DrawStatus.COMPLETED };
        } catch (error) {
            // Rollback to READY on error
            await this.drawRepository.update(drawId, { status: DrawStatus.READY });
            throw error;
        }
    }

    private selectRandomWinner(
        participants: Participant[],
        usedIds: Set<string>,
        noReplacement: boolean
    ): Participant | null {
        // Build pool of available participants
        let pool = participants;

        if (noReplacement) {
            pool = participants.filter((p) => !usedIds.has(p.id));
        }

        if (pool.length === 0) {
            return null;
        }

        // Weighted random selection based on ticketCount
        const weightedPool: Participant[] = [];
        for (const p of pool) {
            for (let i = 0; i < (p.ticketCount || 1); i++) {
                weightedPool.push(p);
            }
        }

        const randomIndex = Math.floor(Math.random() * weightedPool.length);
        return weightedPool[randomIndex];
    }
}
