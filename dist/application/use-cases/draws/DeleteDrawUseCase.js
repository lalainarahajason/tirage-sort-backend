"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDrawUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
class DeleteDrawUseCase {
    constructor(drawRepository) {
        this.drawRepository = drawRepository;
    }
    async execute(id) {
        const draw = await this.drawRepository.findById(id);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        return this.drawRepository.delete(id);
    }
}
exports.DeleteDrawUseCase = DeleteDrawUseCase;
