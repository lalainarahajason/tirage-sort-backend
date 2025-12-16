import { Winner } from '../entities/Winner';

export interface IWinnerRepository {
    create(winner: Winner): Promise<Winner>;
    createMany(winners: Winner[]): Promise<number>;
    findByDrawId(drawId: string): Promise<Winner[]>;
    deleteAllByDrawId(drawId: string): Promise<void>;
}
