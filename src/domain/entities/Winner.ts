// Winner Entity

export interface Winner {
    id: string;
    drawId: string;
    participantId: string;
    prizeId: string;
    wonAt: Date;
}
