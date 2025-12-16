import { Router } from 'express';
import { DrawController } from '../controllers/DrawController';
import { authenticate } from '../middlewares/authenticate';
import { checkDrawAccess } from '../middlewares/checkDrawAccess';

const router = Router();
const drawController = new DrawController();

/**
 * @swagger
 * /draws:
 *   post:
 *     summary: Create a new draw
 *     tags: [Draws]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - settings
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               settings:
 *                 type: object
 *     responses:
 *       201:
 *         description: Draw created
 *   get:
 *     summary: Get all draws
 *     tags: [Draws]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of draws
 */
router.post('/draws', authenticate, drawController.create.bind(drawController));
router.get('/draws', authenticate, drawController.getAll.bind(drawController));

/**
 * @swagger
 * /draws/{id}:
 *   get:
 *     summary: Get a draw by ID
 *     tags: [Draws]
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
 *         description: Draw details
 *       404:
 *         description: Draw not found
 *   patch:
 *     summary: Update a draw
 *     tags: [Draws]
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
 *         description: Draw updated
 *   delete:
 *     summary: Delete a draw
 *     tags: [Draws]
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
 *         description: Draw deleted
 */
router.get('/draws/:id', checkDrawAccess, drawController.getOne.bind(drawController));
router.patch('/draws/:id', authenticate, drawController.update.bind(drawController));
router.delete('/draws/:id', authenticate, drawController.delete.bind(drawController));

/**
 * @swagger
 * /draws/{id}/share:
 *   post:
 *     summary: Generate a share token for a draw
 *     tags: [Draws]
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
 *         description: Share token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shareToken:
 *                   type: string
 */
router.post('/draws/:id/share', authenticate, drawController.generateShareToken.bind(drawController));

/**
 * @swagger
 * /s/{code}:
 *   get:
 *     summary: Get a draw by short code
 *     tags: [Draws]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 8-character short code for the draw
 *     responses:
 *       200:
 *         description: Draw details
 *       403:
 *         description: Access denied (private draw)
 *       404:
 *         description: Draw not found
 */
router.get('/s/:code', drawController.getByShortCode.bind(drawController));

export { router as drawsRouter };
