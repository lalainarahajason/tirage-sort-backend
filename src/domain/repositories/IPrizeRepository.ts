import { Prize } from '../entities/Prize';

export interface IPrizeRepository {
    create(prize: Prize): Promise<Prize>;
    findByDrawId(drawId: string): Promise<Prize[]>;
    findById(id: string): Promise<Prize | null>;
    update(id: string, prize: Partial<Prize>): Promise<Prize>;
    delete(id: string): Promise<void>;
}
