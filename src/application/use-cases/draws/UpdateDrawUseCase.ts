import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { Draw, DrawStatus } from '../../../domain/entities/Draw';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateDrawUseCase {
    constructor(private drawRepository: IDrawRepository) { }

    async execute(id: string, updates: Partial<Draw>) {
        const draw = await this.drawRepository.findById(id);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }
        // Business logic: Cannot update if completed/archived? (Maybe, but for now allow)

        return this.drawRepository.update(id, updates);
    }
}
