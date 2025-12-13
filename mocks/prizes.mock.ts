import { Prize } from '@/types/schemas';

export const MOCK_PRIZES: Prize[] = [
    // Prizes for Draw 1 (Christmas)
    {
        id: 'p1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b1',
        drawId: 'd1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b1',
        name: 'MacBook Pro M3',
        description: 'Le dernier modèle 14 pouces',
        quantity: 1,
        category: 'Gold',
        displayOrder: 1,
        imageUrl: 'https://placehold.co/600x400/png?text=MacBook'
    },
    {
        id: 'p1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b2',
        drawId: 'd1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b1',
        name: 'iPad Air',
        description: 'Tablette légère et puissante',
        quantity: 2,
        category: 'Silver',
        displayOrder: 2,
        imageUrl: 'https://placehold.co/600x400/png?text=iPad'
    },
    {
        id: 'p1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3',
        drawId: 'd1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b1',
        name: 'Carte Cadeau Amazon 50€',
        description: 'Valable sur tout le site',
        quantity: 5,
        category: 'Bronze',
        displayOrder: 3,
        imageUrl: 'https://placehold.co/600x400/png?text=GiftCard'
    },

    // Prizes for Draw 3 (Webinar)
    {
        id: 'p1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b4',
        drawId: 'd1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3',
        name: 'Licence JetBrains',
        description: '1 an d\'abonnement',
        quantity: 10,
        category: 'Licence',
        displayOrder: 1
    }
];
