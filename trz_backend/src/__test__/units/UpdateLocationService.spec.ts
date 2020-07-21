import Location from '../../models/Location.model';
import FakeSurvivorRepository from '../../repositories/Survivor/FakeSurvivor.repository';
import FakeLocationRepository from '../../repositories/Location/FakeLocation.repository';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import ILocationRepository from '../../repositories/Location/ILocation.repository';
import { ISurvivorRequest as ISurvivorDTO } from '../../services/Survivors/CreateSurvivor.service';
import ApiError from '../../Utils/ApiError';
import { survivorFactory } from '../factories';
import UpdateLocationService from '../../services/Locations/UpdateLocation.service';

describe('Update location unit tests', () => {
  let fakeSurvivorRepository: FakeSurvivorRepository;
  let fakeLocationRepository: ILocationRepository;
  let updateLocation: UpdateLocationService;
  let survivorDTO: ISurvivorDTO;

  beforeEach(async () => {
    fakeSurvivorRepository = new FakeSurvivorRepository();
    fakeLocationRepository = new FakeLocationRepository(fakeSurvivorRepository);
    updateLocation = new UpdateLocationService(
      fakeSurvivorRepository as ISurvivorRepository,
      fakeLocationRepository,
    );
    survivorDTO = survivorFactory() as ISurvivorDTO;
    await fakeSurvivorRepository.save(survivorDTO);
  });

  it('should be able to updated a location', async () => {
    const [survivor] = await fakeSurvivorRepository.findAll();
    const { location } = survivorFactory() as ISurvivorDTO;
    const result = await updateLocation.execute({
      survivorId: String(survivor.id),
      location,
    });
    expect(result).toMatchObject(location);
    expect(result).toBeInstanceOf(Location);
  });

  it('should be unable to updated location inexist survivor', async () => {
    const { location } = survivorFactory() as ISurvivorDTO;
    await expect(
      updateLocation.execute({
        survivorId: '2',
        location,
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it('should be unable to update location with types wrongs', async () => {
    const { location } = survivorFactory() as ISurvivorDTO;
    await expect(
      updateLocation.execute({
        survivorId: '1a',
        location,
      }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
