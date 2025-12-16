import { GetParticipantHistoryUseCase } from '../../../src/application/use-cases/participants/GetParticipantHistoryUseCase';
import { IParticipantRepository } from '../../../src/domain/repositories/IParticipantRepository';

describe('GetParticipantHistoryUseCase', () => {
    let getParticipantHistoryUseCase: GetParticipantHistoryUseCase;
    let mockParticipantRepository: jest.Mocked<IParticipantRepository>;

    beforeEach(() => {
        mockParticipantRepository = {
            findDistinctByUserId: jest.fn(),
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
        };

        getParticipantHistoryUseCase = new GetParticipantHistoryUseCase(mockParticipantRepository);
    });

    it('should return participant history', async () => {
        const mockHistory = [
            { id: '1', name: 'Alice', email: 'alice@example.com' },
            { id: '2', name: 'Bob', email: 'bob@example.com' }
        ] as any[];

        mockParticipantRepository.findDistinctByUserId.mockResolvedValue(mockHistory);

        const result = await getParticipantHistoryUseCase.execute('user-1');

        expect(result).toEqual(mockHistory);
        expect(mockParticipantRepository.findDistinctByUserId).toHaveBeenCalledWith('user-1', undefined);
    });

    it('should pass excludeDrawId to repository', async () => {
        mockParticipantRepository.findDistinctByUserId.mockResolvedValue([]);

        await getParticipantHistoryUseCase.execute('user-1', 'draw-excluded');

        expect(mockParticipantRepository.findDistinctByUserId).toHaveBeenCalledWith('user-1', 'draw-excluded');
    });
});
