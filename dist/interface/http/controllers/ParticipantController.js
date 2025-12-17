"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantController = void 0;
const stream_1 = require("stream");
const csv_parser_1 = __importDefault(require("csv-parser"));
const AddParticipantUseCase_1 = require("../../../application/use-cases/participants/AddParticipantUseCase");
const GetParticipantsUseCase_1 = require("../../../application/use-cases/participants/GetParticipantsUseCase");
const ImportParticipantsUseCase_1 = require("../../../application/use-cases/participants/ImportParticipantsUseCase");
const UpdateParticipantUseCase_1 = require("../../../application/use-cases/participants/UpdateParticipantUseCase");
const DeleteParticipantUseCase_1 = require("../../../application/use-cases/participants/DeleteParticipantUseCase");
const ClearParticipantsUseCase_1 = require("../../../application/use-cases/participants/ClearParticipantsUseCase");
const PrismaParticipantRepository_1 = require("../../../infrastructure/repositories/PrismaParticipantRepository");
const PrismaDrawRepository_1 = require("../../../infrastructure/repositories/PrismaDrawRepository");
const AppError_1 = require("../../../shared/errors/AppError");
const GetParticipantHistoryUseCase_1 = require("../../../application/use-cases/participants/GetParticipantHistoryUseCase");
const participantRepository = new PrismaParticipantRepository_1.PrismaParticipantRepository();
const drawRepository = new PrismaDrawRepository_1.PrismaDrawRepository();
const addParticipantUseCase = new AddParticipantUseCase_1.AddParticipantUseCase(participantRepository, drawRepository);
const getParticipantsUseCase = new GetParticipantsUseCase_1.GetParticipantsUseCase(participantRepository, drawRepository);
const importParticipantsUseCase = new ImportParticipantsUseCase_1.ImportParticipantsUseCase(participantRepository, drawRepository);
const updateParticipantUseCase = new UpdateParticipantUseCase_1.UpdateParticipantUseCase(participantRepository);
const deleteParticipantUseCase = new DeleteParticipantUseCase_1.DeleteParticipantUseCase(participantRepository);
const clearParticipantsUseCase = new ClearParticipantsUseCase_1.ClearParticipantsUseCase(participantRepository, drawRepository);
const getParticipantHistoryUseCase = new GetParticipantHistoryUseCase_1.GetParticipantHistoryUseCase(participantRepository);
class ParticipantController {
    async getHistory(req, res, next) {
        try {
            if (!req.user || !req.user.id)
                throw new AppError_1.AppError('Unauthorized', 401);
            const excludeDrawId = typeof req.query.excludeDrawId === 'string' ? req.query.excludeDrawId : undefined;
            const result = await getParticipantHistoryUseCase.execute(req.user.id, excludeDrawId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const result = await addParticipantUseCase.execute({
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
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const result = await getParticipantsUseCase.execute(req.params.drawId, { page, limit });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async import(req, res, next) {
        try {
            if (!req.file) {
                throw new AppError_1.AppError('No file uploaded', 400);
            }
            const results = [];
            const stream = stream_1.Readable.from(req.file.buffer.toString());
            stream
                .pipe((0, csv_parser_1.default)())
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
                }
                catch (err) {
                    next(err);
                }
            })
                .on('error', (err) => next(err));
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const result = await updateParticipantUseCase.execute(req.params.id, req.body);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await deleteParticipantUseCase.execute(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async clear(req, res, next) {
        try {
            await clearParticipantsUseCase.execute(req.params.drawId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ParticipantController = ParticipantController;
