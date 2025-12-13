import { Draw, DrawStatusEnum, DrawModeEnum, DrawTypeEnum } from '@/types/schemas';

export const MOCK_DRAWS: Draw[] = [
    {
        id: 'd1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b1',
        title: 'Tirage au sort de Noël',
        description: 'Grand tirage annuel pour les fêtes de fin d\'année',
        status: 'READY',
        settings: {
            mode: 'WITH_REPLACEMENT',
            type: 'UNIQUE',
            nbWinners: 3,
            presentationTheme: 'christmas-theme'
        },
        createdAt: new Date('2023-12-01T10:00:00Z'),
        updatedAt: new Date('2023-12-05T14:30:00Z'),
        _count: {
            participants: 150,
            winners: 0,
            prizes: 3
        }
    },
    {
        id: 'd1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b2',
        title: 'Conférence Tech 2024',
        description: 'Tirage pour les participants de la conférence',
        status: 'DRAFT',
        settings: {
            mode: 'NO_REPLACEMENT',
            type: 'SEQUENTIAL',
            nbWinners: 1,
        },
        createdAt: new Date('2024-01-15T09:00:00Z'),
        updatedAt: new Date('2024-01-15T09:00:00Z'),
        _count: {
            participants: 0,
            winners: 0,
            prizes: 0
        }
    },
    {
        id: 'd1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3',
        title: 'Webinar React Avançé',
        description: '',
        status: 'COMPLETED',
        settings: {
            mode: 'WITH_REPLACEMENT',
            type: 'UNIQUE',
            nbWinners: 10
        },
        createdAt: new Date('2023-11-20T18:00:00Z'),
        updatedAt: new Date('2023-11-20T20:00:00Z'),
        _count: {
            participants: 45,
            winners: 10,
            prizes: 10
        }
    }
];
