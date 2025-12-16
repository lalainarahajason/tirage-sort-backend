"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.participantsRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ParticipantController_1 = require("../controllers/ParticipantController");
const authenticate_1 = require("../middlewares/authenticate");
const checkDrawAccess_1 = require("../middlewares/checkDrawAccess");
const router = (0, express_1.Router)();
exports.participantsRouter = router;
const participantController = new ParticipantController_1.ParticipantController();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * @swagger
 * /draws/{drawId}/participants:
 *   get:
 *     summary: Get participants for a draw
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: drawId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: shareToken
 *         schema:
 *           type: string
 *         description: Share token for shared draws
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
router.get('/draws/:drawId/participants', checkDrawAccess_1.checkDrawAccess, participantController.getAll.bind(participantController));
router.post('/draws/:drawId/participants', authenticate_1.authenticate, participantController.create.bind(participantController));
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
router.post('/draws/:drawId/participants/import', authenticate_1.authenticate, upload.single('file'), participantController.import.bind(participantController));
router.patch('/participants/:id', authenticate_1.authenticate, participantController.update.bind(participantController));
router.delete('/draws/:drawId/participants', authenticate_1.authenticate, participantController.clear.bind(participantController));
router.delete('/participants/:id', authenticate_1.authenticate, participantController.delete.bind(participantController));
