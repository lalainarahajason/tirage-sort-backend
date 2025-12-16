import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { IParticipantRepository } from '../../../domain/repositories/IParticipantRepository';
import { IPrizeRepository } from '../../../domain/repositories/IPrizeRepository';
import { IWinnerRepository } from '../../../domain/repositories/IWinnerRepository';
import { ExecuteDrawUseCase } from './ExecuteDrawUseCase';

export interface ProcessScheduledDrawsResult {
    processedCount: number;
    results: Array<{
        drawId: string;
        success: boolean;
        winnersCount?: number;
        error?: string;
    }>;
}

export class ProcessScheduledDrawsUseCase {
    private executeDrawUseCase: ExecuteDrawUseCase;

    constructor(
        private drawRepository: IDrawRepository,
        participantRepository: IParticipantRepository,
        prizeRepository: IPrizeRepository,
        winnerRepository: IWinnerRepository
    ) {
        this.executeDrawUseCase = new ExecuteDrawUseCase(
            drawRepository,
            participantRepository,
            prizeRepository,
            winnerRepository
        );
    }

    async execute(): Promise<ProcessScheduledDrawsResult> {
        // Find all draws that need to be executed
        const pendingDraws = await this.drawRepository.findScheduledDraws();

        const results: ProcessScheduledDrawsResult['results'] = [];

        for (const draw of pendingDraws) {
            try {
                const result = await this.executeDrawUseCase.execute(draw.id);
                results.push({
                    drawId: draw.id,
                    success: true,
                    winnersCount: result.winnersCount,
                });
            } catch (error) {
                results.push({
                    drawId: draw.id,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        return {
            processedCount: pendingDraws.length,
            results,
        };
    }
}
