export enum DrawStatus {
    DRAFT = 'DRAFT',
    READY = 'READY',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED',
}

export interface DrawSettings {
    mode: 'WITH_REPLACEMENT' | 'NO_REPLACEMENT';
    type: 'UNIQUE' | 'SEQUENTIAL';
    nbWinners: number;
    presentationTheme?: string;
    excludeCategory?: string[];
}

export interface Draw {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    status: DrawStatus;
    scheduledAt?: Date | null;
    settings: DrawSettings;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        participants: number;
        winners: number;
        prizes: number;
    };
}
