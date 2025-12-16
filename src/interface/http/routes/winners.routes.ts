import { Router, Request, Response, NextFunction } from 'express';
import { PrismaWinnerRepository } from '../../../infrastructure/repositories/PrismaWinnerRepository';
import { checkDrawAccess } from '../middlewares/checkDrawAccess';

const router = Router();
const winnerRepository = new PrismaWinnerRepository();

/**
 * @swagger
 * /draws/{drawId}/winners:
 *   get:
 *     summary: Get winners for a draw
 *     tags: [Winners]
 *     parameters:
 *       - in: path
 *         name: drawId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of winners
 */
router.get('/draws/:drawId/winners', checkDrawAccess, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { drawId } = req.params;
        const winners = await winnerRepository.findByDrawIdWithDetails(drawId);
        res.json(winners);
    } catch (error) {
        next(error);
    }
});

export { router as winnersRouter };
