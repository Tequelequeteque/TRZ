import { injectable, inject } from 'tsyringe';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import Survivor from '../../models/Survivor.model';

@injectable()
export default class FindAllSurvivor {
  constructor(
    @inject('survivorRepository')
    private survivorRepository: ISurvivorRepository,
  ) {}

  public async execute(): Promise<Survivor[]> {
    return this.survivorRepository.findAll();
  }
}
