import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { IParticipantRepository } from '../../../domain/repositories/IParticipantRepository';
import { IPrizeRepository } from '../../../domain/repositories/IPrizeRepository';
import { IWinnerRepository } from '../../../domain/repositories/IWinnerRepository';
import { SocketService } from '../../../infrastructure/services/SocketService';
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
    private socketService: SocketService;

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
        this.socketService = SocketService.getInstance();
    }

    async execute(): Promise<ProcessScheduledDrawsResult> {
        // Find all draws that need to be executed
        const pendingDraws = await this.drawRepository.findScheduledDraws();

        const results: ProcessScheduledDrawsResult['results'] = [];

        for (const draw of pendingDraws) {
            try {
                // Notify that draw is starting
                this.socketService.emitDrawStarted(draw.id);

                const result = await this.executeDrawUseCase.execute(draw.id);
                results.push({
                    drawId: draw.id,
                    success: true,
                    winnersCount: result.winnersCount,
                });

                // Notify winners selected (we might want to enhance ExecuteDrawUseCase to return actual winners to emit them)
                // For now, we just emit that the draw is done/winners selected.
                // ideally executeDrawUseCase would return the winners.
                // Assuming result has winners count, we can refetch winners or just emit a generic "refresh" or "winners_selected" event.
                this.socketService.emitWinnerSelected(draw.id, { count: result.winnersCount });

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
