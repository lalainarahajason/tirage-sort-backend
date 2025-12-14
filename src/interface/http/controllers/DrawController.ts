import { Request, Response, NextFunction } from 'express';
import { CreateDrawUseCase } from '../../../application/use-cases/draws/CreateDrawUseCase';
import { GetDrawsUseCase } from '../../../application/use-cases/draws/GetDrawsUseCase';
import { GetDrawUseCase } from '../../../application/use-cases/draws/GetDrawUseCase';
import { UpdateDrawUseCase } from '../../../application/use-cases/draws/UpdateDrawUseCase';
import { DeleteDrawUseCase } from '../../../application/use-cases/draws/DeleteDrawUseCase';
import { PrismaDrawRepository } from '../../../infrastructure/repositories/PrismaDrawRepository';

const drawRepository = new PrismaDrawRepository();

const createDrawUseCase = new CreateDrawUseCase(drawRepository);
const getDrawsUseCase = new GetDrawsUseCase(drawRepository);
const getDrawUseCase = new GetDrawUseCase(drawRepository);
const updateDrawUseCase = new UpdateDrawUseCase(drawRepository);
const deleteDrawUseCase = new DeleteDrawUseCase(drawRepository);

export class DrawController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const result = await createDrawUseCase.execute(userId, req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const result = await getDrawsUseCase.execute(userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await getDrawUseCase.execute(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await updateDrawUseCase.execute(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await deleteDrawUseCase.execute(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
