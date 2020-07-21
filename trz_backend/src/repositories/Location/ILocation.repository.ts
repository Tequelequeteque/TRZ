import Location from '../../models/Location.model';

export default interface ILocationRepository {
  update(updateLocation: Location): Promise<Location>;
}
