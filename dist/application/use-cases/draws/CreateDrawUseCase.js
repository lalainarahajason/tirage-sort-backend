"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDrawUseCase = void 0;
const Draw_1 = require("../../../domain/entities/Draw");
const crypto_1 = require("crypto");
class CreateDrawUseCase {
    constructor(drawRepository) {
        this.drawRepository = drawRepository;
    }
    async execute(userId, dto) {
        const newDraw = {
            id: (0, crypto_1.randomUUID)(),
            userId,
            title: dto.title,
            description: dto.description || null,
            status: Draw_1.DrawStatus.DRAFT,
            visibility: dto.visibility || Draw_1.DrawVisibility.PUBLIC,
            shareToken: null,
            scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
            settings: dto.settings,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return this.drawRepository.create(newDraw);
    }
}
exports.CreateDrawUseCase = CreateDrawUseCase;
