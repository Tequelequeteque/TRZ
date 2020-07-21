import Inventory from '../../models/Inventory.model';
import IInventoryRepository from './IInventory.repository';
import FakeSurvivorRepository from '../Survivor/FakeSurvivor.repository';

class InventoryRepository implements IInventoryRepository {
  constructor(private fakeSurvivorRepository: FakeSurvivorRepository) {}

  public async update(
    inventory: Inventory,
    anotherInventory: Inventory,
  ): Promise<Inventory[]> {
    const survivor = await this.fakeSurvivorRepository.findById(
      Number(inventory.id),
    );
    const anotherSurvivor = await this.fakeSurvivorRepository.findById(
      Number(inventory.id),
    );
    if (survivor && anotherSurvivor) {
      survivor.inventory = inventory;
      anotherSurvivor.inventory = anotherInventory;
    }
    return Promise.resolve([inventory, anotherInventory]);
  }
}

export default InventoryRepository;
