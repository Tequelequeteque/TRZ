import { getRepository } from 'typeorm';
import Inventory from '../../models/Inventory.model';
import IInventoryRepository from './IInventory.repository';

class InventoryRepository implements IInventoryRepository {
  private inventoryRepository = getRepository(Inventory);

  public update(
    inventory: Inventory,
    anotherInventory: Inventory,
  ): Promise<Inventory[]> {
    const updatedAt = new Date();
    return this.inventoryRepository.save([
      { ...inventory, updatedAt },
      { ...anotherInventory, updatedAt },
    ]);
  }
}

export default InventoryRepository;
