import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import Survivor from '../../models/Survivor.model';
import FakeSurvivorRepository from '../../repositories/Survivor/FakeSurvivor.repository';
import CreateSurvivor, {
  ISurvivorRequest as ISurvivorDTO,
} from '../../services/Survivors/CreateSurvivor.service';
import ApiError from '../../Utils/ApiError';
import { survivorFactory } from '../factories';

describe('Create Survivor unit tests', () => {
  let fakeRepository: ISurvivorRepository;
  let createSurvivor: CreateSurvivor;
  let survivorDTO: ISurvivorDTO;

  beforeEach(() => {
    fakeRepository = new FakeSurvivorRepository();
    createSurvivor = new CreateSurvivor(fakeRepository);
    survivorDTO = survivorFactory() as ISurvivorDTO;
  });

  it('should be able to create a survivor', async () => {
    const result = await createSurvivor.execute(survivorDTO);
    expect(result).toMatchObject({ id: 1 });
    expect(result.inventory).toMatchObject({ id: 1 });
    expect(result.location).toMatchObject({ id: 1 });
    expect(result).toBeInstanceOf(Survivor);
  });

  it('should be unable to create survivor, request incomplete.', async () => {
    const request = survivorDTO;
    delete request.name;
    await expect(createSurvivor.execute(request)).rejects.toBeInstanceOf(
      ApiError,
    );
  });

  it('should be initiate survivor with infected false', async () => {
    const survivor = await createSurvivor.execute(survivorDTO);
    expect(survivor).toMatchObject({ infected: false });
  });
});
