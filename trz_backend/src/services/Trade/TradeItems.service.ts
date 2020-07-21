import * as yup from 'yup';
import { inject, injectable } from 'tsyringe';
import Inventory from '../../models/Inventory.model';
import ApiError from '../../Utils/ApiError';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import IInventoryRepository from '../../repositories/Inventory/IInventory.repository';
import Survivor from '../../models/Survivor.model';

export interface ITradeItems {
  fijiWater: number;
  campbellSoup: number;
  firstAidPouch: number;
  ak47: number;
}

type IKeysTradeItems = keyof ITradeItems;

export interface ITradeRequest {
  survivorId: string;
  survivorItemsGiven: ITradeItems; // survivor's items given
  anotherSurvivorId: string;
  anotherSurvivorItemsGiven: ITradeItems; // another survivor's item given
}

interface ITradeDTO {
  survivorId: number;
  items: ITradeItems;
}

@injectable()
class TradeItemsService {
  constructor(
    @inject('survivorRepository')
    private survivorRepository: ISurvivorRepository,

    @inject('inventoryRepository')
    private inventoryRepository: IInventoryRepository,
  ) {}

  public async execute({
    survivorId,
    anotherSurvivorId,
    survivorItemsGiven: items,
    anotherSurvivorItemsGiven: anotherItems,
  }: ITradeRequest): Promise<Inventory[]> {
    await this.validate({
      survivorId,
      anotherSurvivorId,
      survivorItemsGiven: items,
      anotherSurvivorItemsGiven: anotherItems,
    });
    const ids = {
      survivorId: Number(survivorId),
      anotherSurvivorId: Number(anotherSurvivorId),
    };
    const survivorInventory = await this.checkInventory({
      survivorId: ids.survivorId,
      items,
    });
    const anotherSurvivorInventory = await this.checkInventory(
      { survivorId: ids.anotherSurvivorId, items: anotherItems },
      'Another Survivor dont found',
    );
    this.checkPointsTrade(items, anotherItems);
    return this.changeItems(
      survivorInventory,
      anotherSurvivorInventory,
      items,
      anotherItems,
    );
  }

  private async validate(tradeRequest: ITradeRequest): Promise<void> {
    const schemItems = yup
      .object()
      .shape({
        ak47: yup.number().integer().min(0).required('ak47 is required'),
        campbellSoup: yup
          .number()
          .integer()
          .required('campbellSoup is required'),
        fijiWater: yup
          .number()
          .integer()
          .min(0)
          .required('fijiWater is required'),
        firstAidPouch: yup
          .number()
          .integer()
          .min(0)
          .required('firstAidPouch is required'),
      })
      .required();
    const schema = yup.object().shape({
      survivorId: yup
        .number()
        .integer()
        .min(0)
        .required('survivorId is required'),
      anotherSurvivorId: yup
        .number()
        .integer()
        .min(0)
        .required('anotherSurvivorId is required'),
      survivorItemsGiven: schemItems,
      anotherSurvivorItemsGiven: schemItems,
    });
    try {
      await schema.validate(tradeRequest, { abortEarly: false });
    } catch (err) {
      const error = err as yup.ValidationError;
      throw new ApiError(error.errors.join(','));
    }
    if (tradeRequest.survivorId === tradeRequest.anotherSurvivorId)
      throw new ApiError('You cant trade with yourself');
  }

  private async existsSurvivor(
    id: number,
    errorMessage: string,
  ): Promise<Survivor> {
    const survivor = await this.survivorRepository.findById(id);
    if (!survivor) throw new ApiError(errorMessage, 404);
    if (survivor.infected)
      throw new ApiError(
        'You cant trade items with a zombie, kill him and pick those items!',
      );
    return survivor;
  }

  private async checkInventory(
    { survivorId, items }: ITradeDTO,
    errorMessage = 'Survivor dont found',
  ): Promise<Inventory> {
    const { inventory } = (await this.existsSurvivor(
      survivorId,
      errorMessage,
    )) as Survivor;
    const flag = Object.keys(items).some(
      key => inventory[key as IKeysTradeItems] < items[key as IKeysTradeItems],
    );
    if (flag) throw new ApiError('Survivor dont have those items!', 422);
    return inventory;
  }

  private checkPointsTrade(items: ITradeItems, anotherItems: ITradeItems) {
    const { points } = Inventory;
    const [itemsPoints, anotherItemsPoints] = Object.keys(items).reduce(
      ([itemsPointsAcc, anotherItemsPointsAcc], key) => [
        itemsPointsAcc +
          items[key as IKeysTradeItems] * points[key as IKeysTradeItems],
        anotherItemsPointsAcc +
          anotherItems[key as IKeysTradeItems] * points[key as IKeysTradeItems],
      ],
      [0, 0],
    );
    if (itemsPoints !== anotherItemsPoints)
      throw new ApiError('Trading are unbalanced points', 422);
  }

  private async changeItems(
    inventory: Inventory,
    anotherInventory: Inventory,
    items: ITradeItems,
    anotherItems: ITradeItems,
  ): Promise<Inventory[]> {
    Object.keys(items).forEach(key => {
      type IKeysTradeItems = keyof ITradeItems;
      // eslint-disable-next-line no-param-reassign
      inventory[key as IKeysTradeItems] +=
        anotherItems[key as IKeysTradeItems] - items[key as IKeysTradeItems];
      // eslint-disable-next-line no-param-reassign
      anotherInventory[key as IKeysTradeItems] +=
        items[key as IKeysTradeItems] - anotherItems[key as IKeysTradeItems];
    });
    if (inventory.ak47 === 0 || anotherInventory.ak47 === 0)
      throw new ApiError('do you plan kill someone ?', 422);
    return this.inventoryRepository.update(inventory, anotherInventory);
  }
}

export default TradeItemsService;
