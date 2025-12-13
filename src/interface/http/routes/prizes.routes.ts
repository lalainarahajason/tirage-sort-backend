import { Router } from 'express';
import { PrizeController } from '../controllers/PrizeController';
import { authenticate } from '../middlewares/authenticate';

const router = Router();
const prizeController = new PrizeController();

/**
 * @swagger
 * /draws/{drawId}/prizes:
 *   get:
 *     summary: Get prizes for a draw
 *     tags: [Prizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drawId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of prizes
 *   post:
 *     summary: Add a prize
 *     tags: [Prizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drawId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Prize added
 */
router.get('/draws/:drawId/prizes', authenticate, prizeController.getAll.bind(prizeController));
router.post('/draws/:drawId/prizes', authenticate, prizeController.create.bind(prizeController));

/**
 * @swagger
 * /prizes/{id}:
 *   patch:
 *     summary: Update a prize
 *     tags: [Prizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prize updated
 *   delete:
 *     summary: Delete a prize
 *     tags: [Prizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Prize deleted
 */
router.patch('/prizes/:id', authenticate, prizeController.update.bind(prizeController));
router.delete('/prizes/:id', authenticate, prizeController.delete.bind(prizeController));

export { router as prizesRouter };
