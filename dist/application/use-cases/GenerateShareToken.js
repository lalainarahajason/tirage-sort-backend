"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateShareToken = void 0;
const crypto_1 = require("crypto");
// Characters for short codes: A-Z, a-z, 0-9 (62 chars)
const SHORTCODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SHORTCODE_LENGTH = 8;
function generateShortCode() {
    const bytes = (0, crypto_1.randomBytes)(SHORTCODE_LENGTH);
    let result = '';
    for (let i = 0; i < SHORTCODE_LENGTH; i++) {
        result += SHORTCODE_CHARS[bytes[i] % SHORTCODE_CHARS.length];
    }
    return result;
}
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
        // Generate unique token and short code
        const shareToken = (0, crypto_1.randomUUID)();
        const shortCode = generateShortCode();
        // Update the draw with the new share token and short code
        await this.drawRepository.update(drawId, {
            shareToken,
            shortCode
        });
        return { shareToken, shortCode };
    }
}
exports.GenerateShareToken = GenerateShareToken;
