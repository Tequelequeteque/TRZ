import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import FakeSurvivorRepository from '../../repositories/Survivor/FakeSurvivor.repository';
import FindAllSurvivors from '../../services/Survivors/FindAllSurvivors.service';
import { ISurvivorRequest as ISurvivorDTO } from '../../services/Survivors/CreateSurvivor.service';
import { survivorFactory } from '../factories';

describe('Find all survivors unit tests', () => {
  let fakeRepository: ISurvivorRepository;
  let findAllSurvivors: FindAllSurvivors;
  let survivorDTO: ISurvivorDTO;

  beforeEach(async () => {
    fakeRepository = new FakeSurvivorRepository();
    findAllSurvivors = new FindAllSurvivors(fakeRepository);
    survivorDTO = survivorFactory() as ISurvivorDTO;
    await fakeRepository.save(survivorDTO);
  });

  it('should be able return all survivors', async () => {
    await fakeRepository.save(survivorDTO);
    const result = await findAllSurvivors.execute();
    expect(result).toHaveLength(2);
  });

  it('should be able return exact survivor has save.', async () => {
    const [first] = await findAllSurvivors.execute();
    expect(first).toMatchObject(survivorDTO);
  });
});
