"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winnersRouter = void 0;
const express_1 = require("express");
const PrismaWinnerRepository_1 = require("../../../infrastructure/repositories/PrismaWinnerRepository");
const checkDrawAccess_1 = require("../middlewares/checkDrawAccess");
const router = (0, express_1.Router)();
exports.winnersRouter = router;
const winnerRepository = new PrismaWinnerRepository_1.PrismaWinnerRepository();
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
router.get('/draws/:drawId/winners', checkDrawAccess_1.checkDrawAccess, async (req, res, next) => {
    try {
        const { drawId } = req.params;
        const winners = await winnerRepository.findByDrawIdWithDetails(drawId);
        res.json(winners);
    }
    catch (error) {
        next(error);
    }
});
