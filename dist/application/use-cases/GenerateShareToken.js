"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateShareToken = void 0;
const uuid_1 = require("uuid");
const Draw_1 = require("../../domain/entities/Draw");
class GenerateShareToken {
    constructor(drawRepository) {
        this.drawRepository = drawRepository;
    }
    async execute(drawId, userId) {
        const draw = await this.drawRepository.findById(drawId);
        if (!draw) {
            throw new Error('Draw not found');
        }
        if (draw.userId !== userId) {
            throw new Error('Unauthorized');
        }
        // Generate a unique token
        const shareToken = (0, uuid_1.v4)();
        // Update the draw with SHARED visibility and the new token
        await this.drawRepository.update(drawId, {
            visibility: Draw_1.DrawVisibility.SHARED,
            shareToken
        });
        return shareToken;
    }
}
exports.GenerateShareToken = GenerateShareToken;
