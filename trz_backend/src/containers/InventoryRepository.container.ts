import { container } from 'tsyringe';
import IInventoryRepository from '../repositories/Inventory/IInventory.repository';
import InventoryRepository from '../repositories/Inventory/Inventory.repository';

container.registerSingleton<IInventoryRepository>(
  'inventoryRepository',
  InventoryRepository,
);
