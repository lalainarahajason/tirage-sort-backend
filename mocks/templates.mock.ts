import { Template } from '@/types/schemas';

export const MOCK_TEMPLATES: Template[] = [
    {
        id: 't1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b1',
        name: 'Christmas Magic',
        description: 'Thème festif avec flocons de neige',
        backgroundColor: '#0f172a',
        primaryColor: '#e11d48',
        textColor: '#ffffff',
        backgroundImageUrl: 'https://placehold.co/1920x1080/png?text=Snow+Background'
    },
    {
        id: 't1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b2',
        name: 'Corporate Blue',
        description: 'Thème professionnel standard',
        backgroundColor: '#ffffff',
        primaryColor: '#2563eb',
        textColor: '#1e293b',
    },
    {
        id: 't1b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3',
        name: 'Luxury Gold',
        description: ' Pour les événements de gala',
        backgroundColor: '#1c1917',
        primaryColor: '#d4af37',
        textColor: '#f5f5f4',
        backgroundVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' // Placeholder video
    }
];
