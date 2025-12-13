"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPrizeUseCase = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const crypto_1 = require("crypto");
class AddPrizeUseCase {
    constructor(prizeRepository, drawRepository) {
        this.prizeRepository = prizeRepository;
        this.drawRepository = drawRepository;
    }
    async execute(dto) {
        const draw = await this.drawRepository.findById(dto.drawId);
        if (!draw) {
            throw new AppError_1.AppError('Draw not found', 404);
        }
        const newPrize = {
            id: (0, crypto_1.randomUUID)(),
            drawId: dto.drawId,
            name: dto.name,
            description: dto.description || null,
            quantity: dto.quantity,
            category: dto.category || null,
            imageUrl: dto.imageUrl || null,
            displayOrder: dto.displayOrder || 0, // Should logically find max order and increment, but simple 0 for now
        };
        return this.prizeRepository.create(newPrize);
    }
}
exports.AddPrizeUseCase = AddPrizeUseCase;
