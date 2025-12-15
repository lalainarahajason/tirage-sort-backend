"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDrawsUseCase = void 0;
class GetDrawsUseCase {
    constructor(drawRepository) {
        this.drawRepository = drawRepository;
    }
    async execute(userId) {
        return this.drawRepository.findAll(userId);
    }
}
exports.GetDrawsUseCase = GetDrawsUseCase;
