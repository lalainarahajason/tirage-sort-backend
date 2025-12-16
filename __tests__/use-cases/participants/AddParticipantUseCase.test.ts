import { AddParticipantUseCase } from '../../../src/application/use-cases/participants/AddParticipantUseCase';
import { IParticipantRepository } from '../../../src/domain/repositories/IParticipantRepository';
import { IDrawRepository } from '../../../src/domain/repositories/IDrawRepository';
import { Draw, DrawStatus, DrawVisibility } from '../../../src/domain/entities/Draw';

describe('AddParticipantUseCase', () => {
    let addParticipantUseCase: AddParticipantUseCase;
    let mockParticipantRepository: jest.Mocked<IParticipantRepository>;
    let mockDrawRepository: jest.Mocked<IDrawRepository>;

    const mockDraw: Draw = {
        id: 'draw-1',
        userId: 'user-1',
        title: 'Test Draw',
        status: DrawStatus.DRAFT,
        visibility: DrawVisibility.PUBLIC,
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
            mode: 'NO_REPLACEMENT',
            type: 'UNIQUE',
            nbWinners: 5
        } as any,
        shareToken: null,
        scheduledAt: null,
    };

    beforeEach(() => {
        mockParticipantRepository = {
            create: jest.fn(),
            findByEmail: jest.fn(),
            createMany: jest.fn(),
            findByDrawId: jest.fn(),
            findAllByDrawId: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteAllByDrawId: jest.fn(),
            countByDrawId: jest.fn(),
            findDistinctByUserId: jest.fn(),
        };

        mockDrawRepository = {
            findById: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<IDrawRepository>; // Partial mock if needed, or full

        addParticipantUseCase = new AddParticipantUseCase(mockParticipantRepository, mockDrawRepository);
    });

    it('should create participant successfully when email is unique', async () => {
        mockDrawRepository.findById.mockResolvedValue(mockDraw);
        mockParticipantRepository.findByEmail.mockResolvedValue(null);
        mockParticipantRepository.create.mockImplementation(async (p) => p);

        const dto = {
            drawId: 'draw-1',
            name: 'John Doe',
            email: 'john@example.com',
            ticketCount: 1,
            category: 'STANDARD'
        };

        const result = await addParticipantUseCase.execute(dto);

        expect(result).toBeDefined();
        expect(result.name).toBe(dto.name);
        expect(mockParticipantRepository.findByEmail).toHaveBeenCalledWith(dto.drawId, dto.email);
        expect(mockParticipantRepository.create).toHaveBeenCalled();
    });

    it('should throw error when participant with same email exists in draw', async () => {
        mockDrawRepository.findById.mockResolvedValue(mockDraw);
        mockParticipantRepository.findByEmail.mockResolvedValue({ id: 'existing-id' } as any);

        const dto = {
            drawId: 'draw-1',
            name: 'John Doe',
            email: 'john@example.com'
        };

        await expect(addParticipantUseCase.execute(dto))
            .rejects
            .toThrow('Participant with this email already exists in the draw');

        expect(mockParticipantRepository.create).not.toHaveBeenCalled();
    });

    it('should allow duplicate names if email is not provided (or handles null logic)', async () => {
        // If email is optional, we skip findByEmail check
        mockDrawRepository.findById.mockResolvedValue(mockDraw);
        mockParticipantRepository.create.mockImplementation(async (p) => p);

        const dto = {
            drawId: 'draw-1',
            name: 'John Doe',
            // No email
        };

        const result = await addParticipantUseCase.execute(dto);

        expect(result).toBeDefined();
        expect(mockParticipantRepository.findByEmail).not.toHaveBeenCalled();
        expect(mockParticipantRepository.create).toHaveBeenCalled();
    });
});
