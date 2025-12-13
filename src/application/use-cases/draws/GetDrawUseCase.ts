import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';
import { AppError } from '../../../shared/errors/AppError';

export class GetDrawUseCase {
    constructor(private drawRepository: IDrawRepository) { }

    async execute(id: string) {
        const draw = await this.drawRepository.findById(id);
        if (!draw) {
            throw new AppError('Draw not found', 404);
        }
        return draw;
    }
}
