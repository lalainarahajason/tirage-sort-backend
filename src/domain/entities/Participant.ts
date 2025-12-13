export interface Participant {
    id: string;
    drawId: string;
    name: string;
    email?: string | null;
    category: string;
    ticketCount: number;
    ticketNumber: string;
    importBatchId?: string | null;
}
