import { Draw } from '../entities/Draw';

export interface IDrawRepository {
    create(draw: Draw): Promise<Draw>;
    findById(id: string): Promise<Draw | null>;
    findByShortCode(shortCode: string): Promise<Draw | null>;
    findAll(userId: string): Promise<Draw[]>;
    findScheduledDraws(): Promise<Draw[]>;
    update(id: string, draw: Partial<Draw>): Promise<Draw>;
    delete(id: string): Promise<void>;
}
