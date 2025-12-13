"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePrizeUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class DeletePrizeUseCase {
    constructor(prizeRepository) {
        this.prizeRepository = prizeRepository;
    }
    async execute(id) {
        const prize = await this.prizeRepository.findById(id);
        if (!prize) {
            throw new AppError_1.AppError('Prize not found', 404);
        }
        await this.prizeRepository.delete(id);
    }
}
exports.DeletePrizeUseCase = DeletePrizeUseCase;
