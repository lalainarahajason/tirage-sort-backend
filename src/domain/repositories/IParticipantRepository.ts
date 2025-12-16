import { Participant } from '../entities/Participant';

export interface ParticipantFilters {
    drawId: string;
}

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
}

export interface IParticipantRepository {
    create(participant: Participant): Promise<Participant>;
    createMany(participants: Participant[]): Promise<number>;
    findByDrawId(drawId: string, options?: PaginationOptions): Promise<PaginatedResult<Participant>>;
    findAllByDrawId(drawId: string): Promise<Participant[]>;
    findById(id: string): Promise<Participant | null>;
    update(id: string, data: Partial<Participant>): Promise<Participant>;
    delete(id: string): Promise<void>;
    deleteAllByDrawId(drawId: string): Promise<void>;
    countByDrawId(drawId: string): Promise<number>;
    findDistinctByUserId(userId: string): Promise<Participant[]>;
}
