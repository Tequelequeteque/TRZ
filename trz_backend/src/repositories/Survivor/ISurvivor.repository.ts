import Survivor from '../../models/Survivor.model';
import { ISurvivorRequest as ISurvivorDTO } from '../../services/Survivors/CreateSurvivor.service';

export default interface ISurvivorRepository {
  save(survivor: ISurvivorDTO): Promise<Survivor>;
  findById(id: number): Promise<Survivor | undefined>;
  findAll(): Promise<Survivor[]>;
}
