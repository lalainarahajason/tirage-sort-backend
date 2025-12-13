"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePrizeUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class UpdatePrizeUseCase {
    constructor(prizeRepository) {
        this.prizeRepository = prizeRepository;
    }
    async execute(id, updates) {
        const prize = await this.prizeRepository.findById(id);
        if (!prize) {
            throw new AppError_1.AppError('Prize not found', 404);
        }
        return this.prizeRepository.update(id, updates);
    }
}
exports.UpdatePrizeUseCase = UpdatePrizeUseCase;
