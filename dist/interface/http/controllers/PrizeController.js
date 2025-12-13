"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrizeController = void 0;
const AddPrizeUseCase_1 = require("../../../application/use-cases/prizes/AddPrizeUseCase");
const GetPrizesUseCase_1 = require("../../../application/use-cases/prizes/GetPrizesUseCase");
const UpdatePrizeUseCase_1 = require("../../../application/use-cases/prizes/UpdatePrizeUseCase");
const DeletePrizeUseCase_1 = require("../../../application/use-cases/prizes/DeletePrizeUseCase");
const PrismaPrizeRepository_1 = require("../../../infrastructure/repositories/PrismaPrizeRepository");
const PrismaDrawRepository_1 = require("../../../infrastructure/repositories/PrismaDrawRepository");
const prizeRepository = new PrismaPrizeRepository_1.PrismaPrizeRepository();
const drawRepository = new PrismaDrawRepository_1.PrismaDrawRepository();
const addPrizeUseCase = new AddPrizeUseCase_1.AddPrizeUseCase(prizeRepository, drawRepository);
const getPrizesUseCase = new GetPrizesUseCase_1.GetPrizesUseCase(prizeRepository, drawRepository);
const updatePrizeUseCase = new UpdatePrizeUseCase_1.UpdatePrizeUseCase(prizeRepository);
const deletePrizeUseCase = new DeletePrizeUseCase_1.DeletePrizeUseCase(prizeRepository);
class PrizeController {
    async create(req, res, next) {
        try {
            const result = await addPrizeUseCase.execute({
                ...req.body,
                drawId: req.params.drawId,
            });
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const result = await getPrizesUseCase.execute(req.params.drawId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const result = await updatePrizeUseCase.execute(req.params.id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await deletePrizeUseCase.execute(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PrizeController = PrizeController;
