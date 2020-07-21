import Location from '../../models/Location.model';
import ILocationRepository from './ILocation.repository';
import FakeSurvivorRepository from '../Survivor/FakeSurvivor.repository';

class LocationRepository implements ILocationRepository {
  constructor(private fakeSurvivorRepository: FakeSurvivorRepository) {}

  public async update(updateLocation: Location): Promise<Location> {
    const survirvor = await this.fakeSurvivorRepository.findById(
      Number(updateLocation.id),
    );
    const newLocation = Object.assign(new Location(), {
      ...survirvor?.location,
      ...updateLocation,
      updatedAt: new Date(),
    });
    if (survirvor) survirvor.location = newLocation;
    return Promise.resolve(newLocation);
  }
}

export default LocationRepository;
