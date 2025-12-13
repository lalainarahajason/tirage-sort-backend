export interface Prize {
    id: string;
    drawId: string;
    name: string;
    description?: string | null;
    quantity: number;
    category?: string | null;
    imageUrl?: string | null;
    displayOrder: number;
}
