import dotenv from 'dotenv';
dotenv.config();

import { ProcessScheduledDrawsUseCase } from './src/application/use-cases/draws/ProcessScheduledDrawsUseCase';
import { PrismaDrawRepository } from './src/infrastructure/repositories/PrismaDrawRepository';
import { PrismaParticipantRepository } from './src/infrastructure/repositories/PrismaParticipantRepository';
import { PrismaWinnerRepository } from './src/infrastructure/repositories/PrismaWinnerRepository';
import { PrismaPrizeRepository } from './src/infrastructure/repositories/PrismaPrizeRepository';

async function main() {
    try {
        console.log('Initializing repositories...');
        const drawRepo = new PrismaDrawRepository();
        const participantRepo = new PrismaParticipantRepository();
        const winnerRepo = new PrismaWinnerRepository();
        const prizeRepo = new PrismaPrizeRepository();

        const processUseCase = new ProcessScheduledDrawsUseCase(
            drawRepo,
            participantRepo,
            prizeRepo,
            winnerRepo
        );

        console.log('Processing scheduled draws...');
        const result = await processUseCase.execute();
        console.log('Execution result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error executing force-cron:', error);
    }
}

main();
