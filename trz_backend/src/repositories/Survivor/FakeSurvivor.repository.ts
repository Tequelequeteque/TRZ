import Inventory from '../../models/Inventory.model';
import Survivor from '../../models/Survivor.model';
import ReportedInfected from '../../models/ReportedInfected.model';
import { ISurvivorRequest as ISurvivorDTO } from '../../services/Survivors/CreateSurvivor.service';
import ISurvivorRepository from './ISurvivor.repository';

export default class FakeSurvivorRepository implements ISurvivorRepository {
  private survivorRepository: Survivor[] = [];

  public save(survivor: ISurvivorDTO): Promise<Survivor> {
    const { inventory, location } = survivor;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const id = this.survivorRepository.length + 1;
    const newSurvivor = Object.assign(new Survivor(), {
      ...survivor,
      id,
      createdAt,
      updatedAt,
      inventory: Object.assign(new Inventory(), {
        ...inventory,
        id,
        createdAt,
        updatedAt,
      }),
      location: { ...location, id, createdAt, updatedAt },
      reported: [] as ReportedInfected[],
    });
    this.survivorRepository.push(newSurvivor);
    return Promise.resolve(newSurvivor);
  }

  public findById(id: number): Promise<Survivor | undefined> {
    return Promise.resolve(
      this.survivorRepository.find(survivor => survivor.id === id),
    );
  }

  public findAll(): Promise<Survivor[]> {
    return Promise.resolve(this.survivorRepository);
  }
}
