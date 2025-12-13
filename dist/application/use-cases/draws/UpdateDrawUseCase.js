"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDrawUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class UpdateDrawUseCase {
    constructor(drawRepository) {
        this.drawRepository = drawRepository;
    }
    async execute(id, updates) {
        const draw = await this.drawRepository.findById(id);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        // Business logic: Cannot update if completed/archived? (Maybe, but for now allow)
        return this.drawRepository.update(id, updates);
    }
}
exports.UpdateDrawUseCase = UpdateDrawUseCase;
