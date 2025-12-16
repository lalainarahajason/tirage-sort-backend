// Mock crypto.randomUUID before importing the use case
jest.mock('crypto', () => ({
    ...jest.requireActual('crypto'),
    randomUUID: jest.fn(() => 'mocked-uuid-token-1234-5678-90ab-cdef'),
}));

import { GenerateShareToken } from '../../src/application/use-cases/GenerateShareToken';
import { IDrawRepository } from '../../src/domain/repositories/IDrawRepository';
import { Draw, DrawStatus, DrawVisibility } from '../../src/domain/entities/Draw';

describe('GenerateShareToken', () => {
    let generateShareToken: GenerateShareToken;
    let mockDrawRepository: jest.Mocked<IDrawRepository>;

    const mockDraw: Draw = {
        id: 'draw-123',
        userId: 'user-123',
        title: 'Test Draw',
        description: 'Test description',
        status: DrawStatus.DRAFT,
        visibility: DrawVisibility.PUBLIC,
        shareToken: null,
        scheduledAt: null,
        settings: {
            mode: 'NO_REPLACEMENT',
            type: 'UNIQUE',
            nbWinners: 5,
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    beforeEach(() => {
        mockDrawRepository = {
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        generateShareToken = new GenerateShareToken(mockDrawRepository);
    });

    describe('execute', () => {
        it('should generate a share token for an existing draw', async () => {
            // Arrange
            mockDrawRepository.findById.mockResolvedValue(mockDraw);
            mockDrawRepository.update.mockResolvedValue({
                ...mockDraw,
                visibility: DrawVisibility.SHARED,
                shareToken: 'generated-token',
            });

            // Act
            const result = await generateShareToken.execute('draw-123', 'user-123');

            // Assert
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
            expect(mockDrawRepository.findById).toHaveBeenCalledWith('draw-123');
            expect(mockDrawRepository.update).toHaveBeenCalledWith('draw-123', {
                visibility: DrawVisibility.SHARED,
                shareToken: expect.any(String),
            });
        });

        it('should throw error if draw not found', async () => {
            // Arrange
            mockDrawRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(
                generateShareToken.execute('non-existent-draw', 'user-123')
            ).rejects.toThrow('Draw not found');

            expect(mockDrawRepository.findById).toHaveBeenCalledWith('non-existent-draw');
            expect(mockDrawRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error if user is not the owner', async () => {
            // Arrange
            mockDrawRepository.findById.mockResolvedValue(mockDraw);

            // Act & Assert
            await expect(
                generateShareToken.execute('draw-123', 'different-user')
            ).rejects.toThrow('Unauthorized');

            expect(mockDrawRepository.findById).toHaveBeenCalledWith('draw-123');
            expect(mockDrawRepository.update).not.toHaveBeenCalled();
        });

        it('should update draw visibility to SHARED', async () => {
            // Arrange
            mockDrawRepository.findById.mockResolvedValue(mockDraw);
            mockDrawRepository.update.mockResolvedValue({
                ...mockDraw,
                visibility: DrawVisibility.SHARED,
                shareToken: 'new-token',
            });

            // Act
            await generateShareToken.execute('draw-123', 'user-123');

            // Assert
            expect(mockDrawRepository.update).toHaveBeenCalledWith('draw-123', {
                visibility: DrawVisibility.SHARED,
                shareToken: expect.any(String),
            });
        });

        it('should use crypto.randomUUID to generate token', async () => {
            // Arrange
            mockDrawRepository.findById.mockResolvedValue(mockDraw);
            mockDrawRepository.update.mockResolvedValue({
                ...mockDraw,
                visibility: DrawVisibility.SHARED,
                shareToken: 'uuid-token',
            });

            // Act
            const token = await generateShareToken.execute('draw-123', 'user-123');

            // Assert
            // Since we're mocking uuid, we expect the mocked value
            expect(token).toBe('mocked-uuid-token-1234-5678-90ab-cdef');
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
        });
    });
});
