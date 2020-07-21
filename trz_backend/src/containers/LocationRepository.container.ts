import { container } from 'tsyringe';
import ILocationRepository from '../repositories/Location/ILocation.repository';
import LocationRepository from '../repositories/Location/Location.repository';

container.registerSingleton<ILocationRepository>(
  'locationRepository',
  LocationRepository,
);
