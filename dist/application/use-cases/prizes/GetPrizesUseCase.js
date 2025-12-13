"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPrizesUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class GetPrizesUseCase {
    constructor(prizeRepository, drawRepository) {
        this.prizeRepository = prizeRepository;
        this.drawRepository = drawRepository;
    }
    async execute(drawId) {
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        return this.prizeRepository.findByDrawId(drawId);
    }
}
exports.GetPrizesUseCase = GetPrizesUseCase;
