import { Participant } from '@/types/schemas';

const DRAW_CHRISTMAS_ID = 'd1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b1';
const DRAW_TECH_ID = 'd1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b2';

export const MOCK_PARTICIPANTS: Participant[] = [
    // Participants for Christmas Draw
    {
        id: 'par-1',
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        category: 'STANDARD',
        ticketCount: 1,
        ticketNumber: 'T-2024-X8J9',
        drawId: DRAW_CHRISTMAS_ID
    },
    {
        id: 'par-2',
        name: 'Marie Curie',
        email: 'marie.curie@science.org',
        category: 'VIP',
        ticketCount: 3,
        ticketNumber: 'T-2024-RAD1',
        drawId: DRAW_CHRISTMAS_ID
    },
    {
        id: 'par-3',
        name: 'Albert Einstein',
        category: 'VIP',
        ticketCount: 1,
        ticketNumber: 'T-2024-MC2',
        drawId: DRAW_CHRISTMAS_ID
    },
    {
        id: 'par-4',
        name: 'Thomas Pesquet',
        email: 'thomas@space.ea',
        category: 'STANDARD',
        ticketCount: 1,
        drawId: DRAW_CHRISTMAS_ID
    },
    // ... let's pretend there are ~150 participants
];

// Génération de 146 participants supplémentaires pour atteindre 150
for (let i = 5; i <= 150; i++) {
    MOCK_PARTICIPANTS.push({
        id: `par-${i}`,
        name: `Participant #${i}`,
        email: `participant${i}@mock.com`,
        category: i % 10 === 0 ? 'VIP' : 'STANDARD',
        ticketCount: 1,
        ticketNumber: `T-2024-${1000 + i}`,
        drawId: DRAW_CHRISTMAS_ID
    });
}
