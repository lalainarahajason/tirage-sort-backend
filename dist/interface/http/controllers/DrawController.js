"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawController = void 0;
const CreateDrawUseCase_1 = require("../../../application/use-cases/draws/CreateDrawUseCase");
const GetDrawsUseCase_1 = require("../../../application/use-cases/draws/GetDrawsUseCase");
const GetDrawUseCase_1 = require("../../../application/use-cases/draws/GetDrawUseCase");
const UpdateDrawUseCase_1 = require("../../../application/use-cases/draws/UpdateDrawUseCase");
const DeleteDrawUseCase_1 = require("../../../application/use-cases/draws/DeleteDrawUseCase");
const GenerateShareToken_1 = require("../../../application/use-cases/GenerateShareToken");
const PrismaDrawRepository_1 = require("../../../infrastructure/repositories/PrismaDrawRepository");
const drawRepository = new PrismaDrawRepository_1.PrismaDrawRepository();
const createDrawUseCase = new CreateDrawUseCase_1.CreateDrawUseCase(drawRepository);
const getDrawsUseCase = new GetDrawsUseCase_1.GetDrawsUseCase(drawRepository);
const getDrawUseCase = new GetDrawUseCase_1.GetDrawUseCase(drawRepository);
const updateDrawUseCase = new UpdateDrawUseCase_1.UpdateDrawUseCase(drawRepository);
const deleteDrawUseCase = new DeleteDrawUseCase_1.DeleteDrawUseCase(drawRepository);
const generateShareTokenUseCase = new GenerateShareToken_1.GenerateShareToken(drawRepository);
class DrawController {
    async create(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await createDrawUseCase.execute(userId, req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await getDrawsUseCase.execute(userId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const result = await getDrawUseCase.execute(req.params.id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const result = await updateDrawUseCase.execute(req.params.id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await deleteDrawUseCase.execute(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async generateShareToken(req, res, next) {
        try {
            const userId = req.user.id;
            const drawId = req.params.id;
            const result = await generateShareTokenUseCase.execute(drawId, userId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getByShortCode(req, res, next) {
        try {
            const shortCode = req.params.code;
            const draw = await drawRepository.findByShortCode(shortCode);
            if (!draw) {
                return res.status(404).json({ message: 'Draw not found' });
            }
            // Only allow access to SHARED or PUBLIC draws via shortCode
            if (draw.visibility === 'PRIVATE') {
                return res.status(403).json({ message: 'Access denied' });
            }
            res.json(draw);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DrawController = DrawController;
