"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessScheduledDrawsUseCase = void 0;
const ExecuteDrawUseCase_1 = require("./ExecuteDrawUseCase");
class ProcessScheduledDrawsUseCase {
    constructor(drawRepository, participantRepository, prizeRepository, winnerRepository) {
        this.drawRepository = drawRepository;
        this.executeDrawUseCase = new ExecuteDrawUseCase_1.ExecuteDrawUseCase(drawRepository, participantRepository, prizeRepository, winnerRepository);
    }
    async execute() {
        // Find all draws that need to be executed
        const pendingDraws = await this.drawRepository.findScheduledDraws();
        const results = [];
        for (const draw of pendingDraws) {
            try {
                const result = await this.executeDrawUseCase.execute(draw.id);
                results.push({
                    drawId: draw.id,
                    success: true,
                    winnersCount: result.winnersCount,
                });
            }
            catch (error) {
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
exports.ProcessScheduledDrawsUseCase = ProcessScheduledDrawsUseCase;
