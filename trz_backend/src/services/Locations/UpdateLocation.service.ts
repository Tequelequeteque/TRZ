import * as yup from 'yup';
import { inject, injectable } from 'tsyringe';
import ApiError from '../../Utils/ApiError';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import ILocationRepository from '../../repositories/Location/ILocation.repository';
import Survivor from '../../models/Survivor.model';
import Location from '../../models/Location.model';

interface ILocationRequest {
  longitude: number;
  latitude: number;
}

export interface IUpdateLocationRequest {
  survivorId: string;
  location: ILocationRequest;
}

export interface IUpdateLocationDTO {
  survivorId: number;
  location: ILocationRequest;
}

@injectable()
class UpdateLocationService {
  constructor(
    @inject('survivorRepository')
    private survivorRepository: ISurvivorRepository,

    @inject('locationRepository')
    private locationRepository: ILocationRepository,
  ) {}

  public async execute({
    survivorId,
    location,
  }: IUpdateLocationRequest): Promise<Location> {
    await this.validate({ survivorId, location });
    const updateLocationDTO = {
      survivorId: Number(survivorId),
      location,
    } as IUpdateLocationDTO;
    const { location: oldLocation } = await this.existsSurvivor(
      updateLocationDTO.survivorId,
    );
    const newLocation = {
      ...oldLocation,
      ...location,
    } as Location;
    return this.locationRepository.update(newLocation);
  }

  private async validate(
    requestUpdateLocation: IUpdateLocationRequest,
  ): Promise<void> {
    const schema = yup.object().shape({
      survivorId: yup
        .number()
        .integer()
        .min(0)
        .required('survivorInfectedId is required'),
      location: yup
        .object()
        .shape({
          longitude: yup.number().required('Location/Longitude is required'),
          latitude: yup.number().required('Location/Latitude is required'),
        })
        .required('Location is required'),
    });
    try {
      await schema.validate(requestUpdateLocation, { abortEarly: false });
    } catch (err) {
      const error = err as yup.ValidationError;
      throw new ApiError(error.errors.join(','));
    }
  }

  private async existsSurvivor(
    id: number,
    errorMessage = 'Survivor dont found',
  ): Promise<Survivor> {
    const survivor = await this.survivorRepository.findById(id);
    if (!survivor) throw new ApiError(errorMessage, 404);
    return survivor;
  }
}

export default UpdateLocationService;
