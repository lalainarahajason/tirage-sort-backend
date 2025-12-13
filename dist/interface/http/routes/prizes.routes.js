"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prizesRouter = void 0;
const express_1 = require("express");
const PrizeController_1 = require("../controllers/PrizeController");
const authenticate_1 = require("../middlewares/authenticate");
const router = (0, express_1.Router)();
exports.prizesRouter = router;
const prizeController = new PrizeController_1.PrizeController();
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
router.get('/draws/:drawId/prizes', authenticate_1.authenticate, prizeController.getAll.bind(prizeController));
router.post('/draws/:drawId/prizes', authenticate_1.authenticate, prizeController.create.bind(prizeController));
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
router.patch('/prizes/:id', authenticate_1.authenticate, prizeController.update.bind(prizeController));
router.delete('/prizes/:id', authenticate_1.authenticate, prizeController.delete.bind(prizeController));
