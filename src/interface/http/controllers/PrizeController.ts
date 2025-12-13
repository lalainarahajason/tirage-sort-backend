import { Request, Response, NextFunction } from 'express';
import { AddPrizeUseCase } from '../../../application/use-cases/prizes/AddPrizeUseCase';
import { GetPrizesUseCase } from '../../../application/use-cases/prizes/GetPrizesUseCase';
import { UpdatePrizeUseCase } from '../../../application/use-cases/prizes/UpdatePrizeUseCase';
import { DeletePrizeUseCase } from '../../../application/use-cases/prizes/DeletePrizeUseCase';
import { PrismaPrizeRepository } from '../../../infrastructure/repositories/PrismaPrizeRepository';
import { PrismaDrawRepository } from '../../../infrastructure/repositories/PrismaDrawRepository';

const prizeRepository = new PrismaPrizeRepository();
const drawRepository = new PrismaDrawRepository();

const addPrizeUseCase = new AddPrizeUseCase(prizeRepository, drawRepository);
const getPrizesUseCase = new GetPrizesUseCase(prizeRepository, drawRepository);
const updatePrizeUseCase = new UpdatePrizeUseCase(prizeRepository);
const deletePrizeUseCase = new DeletePrizeUseCase(prizeRepository);

export class PrizeController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await addPrizeUseCase.execute({
                ...req.body,
                drawId: req.params.drawId,
            });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await getPrizesUseCase.execute(req.params.drawId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await updatePrizeUseCase.execute(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await deletePrizeUseCase.execute(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
