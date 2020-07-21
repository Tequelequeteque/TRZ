import Survivor from '../../models/Survivor.model';
import Inventory from '../../models/Inventory.model';
import FakeSurvivorRepository from '../../repositories/Survivor/FakeSurvivor.repository';
import FakeInventoryRepository from '../../repositories/Inventory/FakeInventory.repository';
import FakeReportedInfectedRepository from '../../repositories/ReportedInfected/FakeReportedInfected.repository';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import IInventoryRepository from '../../repositories/Inventory/IInventory.repository';
import { ISurvivorRequest as ISurvivorDTO } from '../../services/Survivors/CreateSurvivor.service';
import ApiError from '../../Utils/ApiError';
import { survivorFactory } from '../factories';
import TradeItemsService, {
  ITradeItems,
} from '../../services/Trade/TradeItems.service';
import IReportedInfectedRepository from '../../repositories/ReportedInfected/IReportedInfected.repository';

describe('Trade items unit tests', () => {
  let fakeSurvivorRepository: FakeSurvivorRepository;
  let fakeInventoryRepository: IInventoryRepository;
  let fakeReportedInfected: IReportedInfectedRepository;
  let tradeItems: TradeItemsService;
  let survivorDTO: Survivor;
  const inventoryDTO = {
    fijiWater: 5,
    campbellSoup: 5,
    firstAidPouch: 5,
    ak47: 5,
  } as ITradeItems;

  beforeEach(async () => {
    fakeSurvivorRepository = new FakeSurvivorRepository();
    fakeReportedInfected = new FakeReportedInfectedRepository(
      fakeSurvivorRepository,
    );
    fakeInventoryRepository = new FakeInventoryRepository(
      fakeSurvivorRepository,
    );
    tradeItems = new TradeItemsService(
      fakeSurvivorRepository as ISurvivorRepository,
      fakeInventoryRepository,
    );
    survivorDTO = await fakeSurvivorRepository.save(
      survivorFactory({
        inventory: inventoryDTO,
      }) as ISurvivorDTO,
    );
  });

  it('should be able to change items', async () => {
    const anotherSurvivorDTO = survivorFactory({ inventory: inventoryDTO });
    fakeSurvivorRepository.save(anotherSurvivorDTO);
    const [survivor, anotherSurvivor] = await fakeSurvivorRepository.findAll();
    const [inventory, anotherInventory] = await tradeItems.execute({
      survivorId: String(survivor.id),
      anotherSurvivorId: String(anotherSurvivor.id),
      survivorItemsGiven: inventoryDTO,
      anotherSurvivorItemsGiven: inventoryDTO,
    });
    expect(inventory).toBeInstanceOf(Inventory);
    expect(anotherInventory).toBeInstanceOf(Inventory);
  });

  it('should be unable to trade items with inexist survivor', async () => {
    const [survivor] = await fakeSurvivorRepository.findAll();
    await expect(
      tradeItems.execute({
        survivorId: String(survivor.id),
        anotherSurvivorId: '2',
        survivorItemsGiven: inventoryDTO,
        anotherSurvivorItemsGiven: inventoryDTO,
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('should be unable to trade items with survivor dont have those items', async () => {
    const anotherSurvivorDTO = survivorFactory({
      inventory: { ...inventoryDTO, ak47: 4 },
    });
    fakeSurvivorRepository.save(anotherSurvivorDTO);
    const [survivor, anotherSurvivor] = await fakeSurvivorRepository.findAll();
    await expect(
      tradeItems.execute({
        survivorId: String(survivor.id),
        anotherSurvivorId: String(anotherSurvivor.id),
        survivorItemsGiven: inventoryDTO,
        anotherSurvivorItemsGiven: inventoryDTO,
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('should be unable to trade items with unbalance points', async () => {
    const anotherSurvivorDTO = survivorFactory({
      inventory: inventoryDTO,
    });
    fakeSurvivorRepository.save(anotherSurvivorDTO);
    const [survivor, anotherSurvivor] = await fakeSurvivorRepository.findAll();
    await expect(
      tradeItems.execute({
        survivorId: String(survivor.id),
        anotherSurvivorId: String(anotherSurvivor.id),
        survivorItemsGiven: inventoryDTO,
        anotherSurvivorItemsGiven: { ...inventoryDTO, ak47: 4 },
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('should be unable to trade items with someone wanna all your ak47', async () => {
    const anotherSurvivorDTO = survivorFactory({
      inventory: inventoryDTO,
    });
    fakeSurvivorRepository.save(anotherSurvivorDTO);
    const [survivor, anotherSurvivor] = await fakeSurvivorRepository.findAll();
    await expect(
      tradeItems.execute({
        survivorId: String(survivor.id),
        anotherSurvivorId: String(anotherSurvivor.id),
        survivorItemsGiven: { ...inventoryDTO, firstAidPouch: 4, ak47: 0 },
        anotherSurvivorItemsGiven: {
          ...inventoryDTO,
          firstAidPouch: 0,
          ak47: 5,
        },
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('should be unable to trade items pass arguments type wrong', async () => {
    const [survivor] = await fakeSurvivorRepository.findAll();
    await expect(
      tradeItems.execute({
        survivorId: String(survivor.id),
        anotherSurvivorId: '2a',
        survivorItemsGiven: inventoryDTO,
        anotherSurvivorItemsGiven: inventoryDTO,
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('should be unable to trade items with a zombie', async () => {
    const promiseIds = [];
    for (let index = 0; index < 5; index += 1) {
      const anotherSurvivorDTO = survivorFactory({ inventory: inventoryDTO });
      promiseIds.push(fakeSurvivorRepository.save(anotherSurvivorDTO));
    }
    const infectedSurvivorId = 1;
    (await Promise.all(promiseIds)).forEach(s => {
      fakeReportedInfected.save({
        infectedSurvivorId: 1,
        reportedSurvivorId: Number(s.id),
      });
    });
    await expect(
      tradeItems.execute({
        survivorId: String(infectedSurvivorId),
        survivorItemsGiven: inventoryDTO,
        anotherSurvivorId: '2',
        anotherSurvivorItemsGiven: inventoryDTO,
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('should be unable to trade with yourself', async () => {
    const id = String(survivorDTO);
    await expect(
      tradeItems.execute({
        survivorId: id,
        survivorItemsGiven: inventoryDTO,
        anotherSurvivorId: id,
        anotherSurvivorItemsGiven: inventoryDTO,
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
