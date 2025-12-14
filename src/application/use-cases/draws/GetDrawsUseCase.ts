import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';

export class GetDrawsUseCase {
    constructor(private drawRepository: IDrawRepository) { }

    async execute(userId: string) {
        return this.drawRepository.findAll(userId);
    }
}
