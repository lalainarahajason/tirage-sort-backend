import { randomUUID, randomBytes } from 'crypto';
import { IDrawRepository } from '../../domain/repositories/IDrawRepository';
import { DrawVisibility } from '../../domain/entities/Draw';

// Characters for short codes: A-Z, a-z, 0-9 (62 chars)
const SHORTCODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SHORTCODE_LENGTH = 8;

function generateShortCode(): string {
    const bytes = randomBytes(SHORTCODE_LENGTH);
    let result = '';
    for (let i = 0; i < SHORTCODE_LENGTH; i++) {
        result += SHORTCODE_CHARS[bytes[i] % SHORTCODE_CHARS.length];
    }
    return result;
}

export interface GenerateShareTokenResult {
    shareToken: string;
    shortCode: string;
}

export class GenerateShareToken {
    constructor(private drawRepository: IDrawRepository) { }

    async execute(drawId: string, userId: string): Promise<GenerateShareTokenResult> {
        const draw = await this.drawRepository.findById(drawId);

        if (!draw) {
            throw new Error('Draw not found');
        }

        if (draw.userId !== userId) {
            throw new Error('Unauthorized');
        }

        // Generate unique token and short code
        const shareToken = randomUUID();
        const shortCode = generateShortCode();

        // Update the draw with SHARED visibility and the new codes
        await this.drawRepository.update(drawId, {
            visibility: DrawVisibility.SHARED,
            shareToken,
            shortCode
        });

        return { shareToken, shortCode };
    }
}

