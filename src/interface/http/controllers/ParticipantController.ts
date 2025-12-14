import { Request, Response, NextFunction } from 'express';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { AddParticipantUseCase } from '../../../application/use-cases/participants/AddParticipantUseCase';
import { GetParticipantsUseCase } from '../../../application/use-cases/participants/GetParticipantsUseCase';
import { ImportParticipantsUseCase } from '../../../application/use-cases/participants/ImportParticipantsUseCase';
import { UpdateParticipantUseCase } from '../../../application/use-cases/participants/UpdateParticipantUseCase';
import { DeleteParticipantUseCase } from '../../../application/use-cases/participants/DeleteParticipantUseCase';
import { ClearParticipantsUseCase } from '../../../application/use-cases/participants/ClearParticipantsUseCase';
import { PrismaParticipantRepository } from '../../../infrastructure/repositories/PrismaParticipantRepository';
import { PrismaDrawRepository } from '../../../infrastructure/repositories/PrismaDrawRepository';
import { AppError } from '../../../shared/errors/AppError';

const participantRepository = new PrismaParticipantRepository();
const drawRepository = new PrismaDrawRepository();

const addParticipantUseCase = new AddParticipantUseCase(participantRepository, drawRepository);
const getParticipantsUseCase = new GetParticipantsUseCase(participantRepository, drawRepository);
const importParticipantsUseCase = new ImportParticipantsUseCase(participantRepository, drawRepository);
const updateParticipantUseCase = new UpdateParticipantUseCase(participantRepository);
const deleteParticipantUseCase = new DeleteParticipantUseCase(participantRepository);
const clearParticipantsUseCase = new ClearParticipantsUseCase(participantRepository, drawRepository);

export class ParticipantController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await addParticipantUseCase.execute({
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
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const result = await getParticipantsUseCase.execute(req.params.drawId, { page, limit });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async import(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                throw new AppError('No file uploaded', 400);
            }

            const results: any[] = [];
            const stream = Readable.from(req.file.buffer.toString());

            stream
                .pipe(csv())
                .on('data', (data) => {
                    // Normalize keys if needed, assume CSV headers match expected props loosely
                    // Expected: name, email, category, ticketCount
                    results.push({
                        name: data.name,
                        email: data.email,
                        category: data.category,
                        ticketCount: data.ticketCount ? Number(data.ticketCount) : undefined
                    });
                })
                .on('end', async () => {
                    try {
                        const result = await importParticipantsUseCase.execute(req.params.drawId, results);
                        res.json(result);
                    } catch (err) {
                        next(err);
                    }
                })
                .on('error', (err) => next(err));
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await updateParticipantUseCase.execute(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await deleteParticipantUseCase.execute(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async clear(req: Request, res: Response, next: NextFunction) {
        try {
            await clearParticipantsUseCase.execute(req.params.drawId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
