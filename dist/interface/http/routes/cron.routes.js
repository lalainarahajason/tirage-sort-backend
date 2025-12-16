"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProcessScheduledDrawsUseCase_1 = require("../../../application/use-cases/draws/ProcessScheduledDrawsUseCase");
const PrismaDrawRepository_1 = require("../../../infrastructure/repositories/PrismaDrawRepository");
const PrismaParticipantRepository_1 = require("../../../infrastructure/repositories/PrismaParticipantRepository");
const PrismaPrizeRepository_1 = require("../../../infrastructure/repositories/PrismaPrizeRepository");
const PrismaWinnerRepository_1 = require("../../../infrastructure/repositories/PrismaWinnerRepository");
const router = (0, express_1.Router)();
// Repositories
const drawRepository = new PrismaDrawRepository_1.PrismaDrawRepository();
const participantRepository = new PrismaParticipantRepository_1.PrismaParticipantRepository();
const prizeRepository = new PrismaPrizeRepository_1.PrismaPrizeRepository();
const winnerRepository = new PrismaWinnerRepository_1.PrismaWinnerRepository();
// Use case
const processScheduledDrawsUseCase = new ProcessScheduledDrawsUseCase_1.ProcessScheduledDrawsUseCase(drawRepository, participantRepository, prizeRepository, winnerRepository);
/**
 * Vercel Cron endpoint to process scheduled draws
 * Protected by CRON_SECRET
 */
router.post('/process-scheduled-draws', async (req, res, next) => {
    try {
        // Verify cron secret
        const authHeader = req.headers.authorization;
        const cronSecret = process.env.CRON_SECRET;
        if (!cronSecret) {
            console.error('CRON_SECRET not configured');
            return res.status(500).json({ error: 'Cron not configured' });
        }
        if (authHeader !== `Bearer ${cronSecret}`) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Process scheduled draws
        const result = await processScheduledDrawsUseCase.execute();
        console.log(`Processed ${result.processedCount} scheduled draws`);
        res.json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
