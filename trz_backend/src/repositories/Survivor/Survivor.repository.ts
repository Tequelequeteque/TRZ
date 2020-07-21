import { getRepository } from 'typeorm';
import { ISurvivorRequest as ISurvivorDTO } from 'services/Survivors/CreateSurvivor.service';
import Survivor from '../../models/Survivor.model';
import ISurvivorRepository from './ISurvivor.repository';

class SurvivorRepository implements ISurvivorRepository {
  private survivorRepository = getRepository(Survivor);

  public async save(survivor: ISurvivorDTO): Promise<Survivor> {
    const newSurvivor = this.survivorRepository.create(survivor);
    return this.survivorRepository.save(newSurvivor);
  }

  public findById(id: number): Promise<Survivor | undefined> {
    return this.survivorRepository.findOne(id);
  }

  public findAll(): Promise<Survivor[]> {
    return this.survivorRepository.find();
  }
}

export default SurvivorRepository;
