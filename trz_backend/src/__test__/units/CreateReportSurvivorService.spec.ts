import FakeSurvivorRepository from '../../repositories/Survivor/FakeSurvivor.repository';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import { ISurvivorRequest as ISurvivorDTO } from '../../services/Survivors/CreateSurvivor.service';
import { survivorFactory } from '../factories';
import CreateReportSurvivor, {
  IResponse,
} from '../../services/Reports/CreateReportSurvivor.service';
import FakeReportedInfectedRepository from '../../repositories/ReportedInfected/FakeReportedInfected.repository';
import IReportedInfectedRepository from '../../repositories/ReportedInfected/IReportedInfected.repository';
import { ITradeItems } from '../../services/Trade/TradeItems.service';

describe('Update location unit tests', () => {
  let fakeSurvivorRepository: ISurvivorRepository;
  let createReportSurvivor: CreateReportSurvivor;
  let fakeReportedInfectedRepository: IReportedInfectedRepository;
  let survivorDTO: ISurvivorDTO;
  const inventoryDTO = {
    fijiWater: 5,
    campbellSoup: 5,
    firstAidPouch: 5,
    ak47: 5,
  } as ITradeItems;

  beforeEach(async () => {
    fakeSurvivorRepository = new FakeSurvivorRepository();
    fakeReportedInfectedRepository = new FakeReportedInfectedRepository(
      fakeSurvivorRepository,
    );
    createReportSurvivor = new CreateReportSurvivor(fakeSurvivorRepository);
  });

  it('should be able to created a report about survivors', async () => {
    const survivors = [];
    const reportedInfected = [];
    for (let index = 0; index < 5; index += 1) {
      survivorDTO = survivorFactory({
        inventory: inventoryDTO,
      }) as ISurvivorDTO;
      survivors.push(fakeSurvivorRepository.save(survivorDTO));
      reportedInfected.push(
        fakeReportedInfectedRepository.save({
          infectedSurvivorId: 1,
          reportedSurvivorId: index,
        }),
      );
    }
    await Promise.all(survivors);
    await Promise.all(reportedInfected);
    const result = await createReportSurvivor.execute();
    expect(result).toMatchObject({
      percentageInfected: '020.000%',
      percentageNonInfected: '080.000%',
      lostPoints: 220, // (5*14+5*12+5*10+5*8)
      itemsPerSurvivor: inventoryDTO,
    } as IResponse);
  });

  it('should be able to created a report about survivors with no survivors preset', async () => {
    const result = await createReportSurvivor.execute();
    expect(result).toMatchObject({
      percentageInfected: '000.000%',
      percentageNonInfected: '000.000%',
      lostPoints: 0,
      itemsPerSurvivor: {
        ak47: 0,
        campbellSoup: 0,
        fijiWater: 0,
        firstAidPouch: 0,
      },
    } as IResponse);
  });
});
