import { Router, Request, Response, NextFunction } from 'express';
import { ProcessScheduledDrawsUseCase } from '../../../application/use-cases/draws/ProcessScheduledDrawsUseCase';
import { PrismaDrawRepository } from '../../../infrastructure/repositories/PrismaDrawRepository';
import { PrismaParticipantRepository } from '../../../infrastructure/repositories/PrismaParticipantRepository';
import { PrismaPrizeRepository } from '../../../infrastructure/repositories/PrismaPrizeRepository';
import { PrismaWinnerRepository } from '../../../infrastructure/repositories/PrismaWinnerRepository';

const router = Router();

// Repositories
const drawRepository = new PrismaDrawRepository();
const participantRepository = new PrismaParticipantRepository();
const prizeRepository = new PrismaPrizeRepository();
const winnerRepository = new PrismaWinnerRepository();

// Use case
const processScheduledDrawsUseCase = new ProcessScheduledDrawsUseCase(
    drawRepository,
    participantRepository,
    prizeRepository,
    winnerRepository
);

/**
 * Vercel Cron endpoint to process scheduled draws
 * Protected by CRON_SECRET
 */
router.post('/process-scheduled-draws', async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
        next(error);
    }
});

export default router;
