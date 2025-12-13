"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDrawsUseCase = void 0;
class GetDrawsUseCase {
    constructor(drawRepository) {
        this.drawRepository = drawRepository;
    }
    async execute() {
        return this.drawRepository.findAll();
    }
}
exports.GetDrawsUseCase = GetDrawsUseCase;
