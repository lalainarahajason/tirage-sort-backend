import { IDrawRepository } from '../../../domain/repositories/IDrawRepository';

export class GetDrawsUseCase {
    constructor(private drawRepository: IDrawRepository) { }

    async execute() {
        return this.drawRepository.findAll();
    }
}
