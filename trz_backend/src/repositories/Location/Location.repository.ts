import { getRepository } from 'typeorm';
import Location from '../../models/Location.model';
import ILocationRepository from './ILocation.repository';

class LocationRepository implements ILocationRepository {
  private locationRepository = getRepository(Location);

  public update(updateLocation: Location): Promise<Location> {
    return this.locationRepository.save({
      ...updateLocation,
      updatedAt: new Date(),
    });
  }
}

export default LocationRepository;
