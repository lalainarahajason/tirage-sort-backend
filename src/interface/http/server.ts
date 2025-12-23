import 'dotenv/config';
import app from './app';
import { logger } from '../../shared/utils/logger';

const PORT = process.env.PORT || 3000;

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);

        // Local Cron Simulation
        const { prisma } = require('../../infrastructure/database/prismaClient'); // eslint-disable-line @typescript-eslint/no-require-imports
        const { PrismaDrawRepository } = require('../../infrastructure/repositories/PrismaDrawRepository'); // eslint-disable-line @typescript-eslint/no-require-imports
        const { PrismaParticipantRepository } = require('../../infrastructure/repositories/PrismaParticipantRepository'); // eslint-disable-line @typescript-eslint/no-require-imports
        const { PrismaPrizeRepository } = require('../../infrastructure/repositories/PrismaPrizeRepository'); // eslint-disable-line @typescript-eslint/no-require-imports
        const { PrismaWinnerRepository } = require('../../infrastructure/repositories/PrismaWinnerRepository'); // eslint-disable-line @typescript-eslint/no-require-imports
        const { ProcessScheduledDrawsUseCase } = require('../../application/use-cases/draws/ProcessScheduledDrawsUseCase'); // eslint-disable-line @typescript-eslint/no-require-imports

        // const prisma = new PrismaClient(); // Removed: Use existing instance
        const drawRepo = new PrismaDrawRepository(prisma);
        const participantRepo = new PrismaParticipantRepository(prisma);
        const prizeRepo = new PrismaPrizeRepository(prisma);
        const winnerRepo = new PrismaWinnerRepository(prisma);

        const processor = new ProcessScheduledDrawsUseCase(drawRepo, participantRepo, prizeRepo, winnerRepo);

        logger.info('🕒 Local Cron Simulation started (every 60s)');
        setInterval(async () => {
            try {
                const result = await processor.execute();
                if (result.processedCount > 0) {
                    logger.info(`✅ Local Cron: Processed ${result.processedCount} draws`);
                }
            } catch (error) {
                logger.error('❌ Local Cron Error:', error);
            }
        }, 60000); // Check every minute
    });
}

// Export for Vercel
export default app;
