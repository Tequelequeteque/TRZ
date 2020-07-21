import ReportedInfected from '../../models/ReportedInfected.model';
import FakeSurvivorRepository from '../../repositories/Survivor/FakeSurvivor.repository';
import FakeReportedInfectedRepository from '../../repositories/ReportedInfected/FakeReportedInfected.repository';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import IReportedInfectedRepository from '../../repositories/ReportedInfected/IReportedInfected.repository';
import { ISurvivorRequest as ISurvivorDTO } from '../../services/Survivors/CreateSurvivor.service';
import ApiError from '../../Utils/ApiError';
import { survivorFactory } from '../factories';
import CreateReportedInfected from '../../services/ReportedInfected/CreateReportedInfected.service';

describe('Create reported infected unit tests', () => {
  let fakeSurvivorRepository: FakeSurvivorRepository;
  let fakeReportedInfectedRepository: IReportedInfectedRepository;
  let createReportedInfected: CreateReportedInfected;
  let survivorDTO: ISurvivorDTO;

  beforeEach(async () => {
    fakeSurvivorRepository = new FakeSurvivorRepository();
    fakeReportedInfectedRepository = new FakeReportedInfectedRepository(
      fakeSurvivorRepository,
    );
    createReportedInfected = new CreateReportedInfected(
      fakeSurvivorRepository as ISurvivorRepository,
      fakeReportedInfectedRepository,
    );
    survivorDTO = survivorFactory() as ISurvivorDTO;
    await fakeSurvivorRepository.save(survivorDTO);
  });

  it('should be able to create a reported infected', async () => {
    const anotherSurvivorDTO = survivorFactory() as ISurvivorDTO;
    await fakeSurvivorRepository.save(anotherSurvivorDTO);
    const [infected, reported] = await fakeSurvivorRepository.findAll();
    const reportedInfected = await createReportedInfected.execute({
      infectedSurvivorId: String(infected.id),
      reportedSurvivorId: String(reported.id),
    });
    expect(reportedInfected).toMatchObject({
      infectedSurvivorId: infected.id,
      reportedSurvivorId: reported.id,
    });
    expect(reportedInfected).toBeInstanceOf(ReportedInfected);
  });

  it('should be unable to create a reported infected inexist survivors', async () => {
    const [infected] = await fakeSurvivorRepository.findAll();
    await expect(
      createReportedInfected.execute({
        infectedSurvivorId: String(infected.id),
        reportedSurvivorId: '2',
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('should be unable to reported twice the same survivor infected', async () => {
    const anotherSurvivorDTO = survivorFactory() as ISurvivorDTO;
    await fakeSurvivorRepository.save(anotherSurvivorDTO);
    const [infected, reported] = await fakeSurvivorRepository.findAll();
    await createReportedInfected.execute({
      infectedSurvivorId: String(infected.id),
      reportedSurvivorId: String(reported.id),
    });
    await expect(
      createReportedInfected.execute({
        infectedSurvivorId: String(infected.id),
        reportedSurvivorId: String(reported.id),
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('should be unable to create a reported infected with another type id', async () => {
    const [infected] = await fakeSurvivorRepository.findAll();
    await expect(
      createReportedInfected.execute({
        infectedSurvivorId: String(infected.id),
        reportedSurvivorId: '2a',
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
