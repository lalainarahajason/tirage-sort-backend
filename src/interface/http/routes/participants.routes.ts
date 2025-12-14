import { Router } from 'express';
import multer from 'multer';
import { ParticipantController } from '../controllers/ParticipantController';
import { authenticate } from '../middlewares/authenticate';

const router = Router();
const participantController = new ParticipantController();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /draws/{drawId}/participants:
 *   get:
 *     summary: Get participants for a draw
 *     tags: [Participants]
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
 *         description: List of participants
 *   post:
 *     summary: Add a participant
 *     tags: [Participants]
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               ticketCount:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Participant added
 */
router.get('/draws/:drawId/participants', authenticate, participantController.getAll.bind(participantController));
router.post('/draws/:drawId/participants', authenticate, participantController.create.bind(participantController));

/**
 * @swagger
 * /draws/{drawId}/participants/import:
 *   post:
 *     summary: Import participants from CSV
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drawId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Participants imported
 */
router.post('/draws/:drawId/participants/import', authenticate, upload.single('file'), participantController.import.bind(participantController));
router.patch('/participants/:id', authenticate, participantController.update.bind(participantController));
router.delete('/draws/:drawId/participants', authenticate, participantController.clear.bind(participantController));
router.delete('/participants/:id', authenticate, participantController.delete.bind(participantController));

export { router as participantsRouter };
