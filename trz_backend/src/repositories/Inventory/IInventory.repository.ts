import Inventory from '../../models/Inventory.model';

export default interface IInventoryRepository {
  update(
    inventory: Inventory,
    anotherInventory: Inventory,
  ): Promise<Inventory[]>;
}
