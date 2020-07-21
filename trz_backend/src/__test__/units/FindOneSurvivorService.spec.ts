import ApiError from '../../Utils/ApiError';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import FakeSurvivorRepository from '../../repositories/Survivor/FakeSurvivor.repository';
import FindOneSurvivor from '../../services/Survivors/FindOneSurvivor.service';
import { ISurvivorRequest as ISurvivorDTO } from '../../services/Survivors/CreateSurvivor.service';
import { survivorFactory } from '../factories';

describe('Find one survivor unit tests', () => {
  let fakeRepository: ISurvivorRepository;
  let findOneSurvivor: FindOneSurvivor;
  let survivorDTO: ISurvivorDTO;
  let id: string;

  beforeEach(async () => {
    fakeRepository = new FakeSurvivorRepository();
    findOneSurvivor = new FindOneSurvivor(fakeRepository);
    survivorDTO = survivorFactory() as ISurvivorDTO;
    const { id: numberId } = await fakeRepository.save(survivorDTO);
    id = String(numberId);
  });

  it('should be able return a survivor by id', async () => {
    await fakeRepository.save(survivorDTO);
    const result = await findOneSurvivor.execute({ id });
    expect(result).toMatchObject(survivorDTO);
  });

  it('should be unable return a survivor hasnt save.', async () => {
    await expect(findOneSurvivor.execute({ id: '2' })).rejects.toBeInstanceOf(
      ApiError,
    );
  });

  it('should be unable return a survivor with fake id.', async () => {
    await expect(findOneSurvivor.execute({ id: '1a' })).rejects.toBeInstanceOf(
      ApiError,
    );
  });
});
