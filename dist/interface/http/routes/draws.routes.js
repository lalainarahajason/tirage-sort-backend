"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawsRouter = void 0;
const express_1 = require("express");
const DrawController_1 = require("../controllers/DrawController");
const authenticate_1 = require("../middlewares/authenticate");
const router = (0, express_1.Router)();
exports.drawsRouter = router;
const drawController = new DrawController_1.DrawController();
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
router.post('/draws', authenticate_1.authenticate, drawController.create.bind(drawController));
router.get('/draws', authenticate_1.authenticate, drawController.getAll.bind(drawController));
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
router.get('/draws/:id', authenticate_1.authenticate, drawController.getOne.bind(drawController));
router.patch('/draws/:id', authenticate_1.authenticate, drawController.update.bind(drawController));
router.delete('/draws/:id', authenticate_1.authenticate, drawController.delete.bind(drawController));
