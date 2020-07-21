import * as yup from 'yup';
import { inject, injectable } from 'tsyringe';
import ApiError from '../../Utils/ApiError';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import Survivor from '../../models/Survivor.model';

interface ILocationRequest {
  longitude: number;
  latitude: number;
}

interface IInventoryRequest {
  fijiWater: number;
  ak47: number;
  campbellSoup: number;
  firstAidPouch: number;
}

export interface ISurvivorRequest {
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: ILocationRequest;
  inventory: IInventoryRequest;
}

@injectable()
class CreateSurvivor {
  constructor(
    @inject('survivorRepository')
    private survivorRepository: ISurvivorRepository,
  ) {}

  public async execute(survivor: ISurvivorRequest): Promise<Survivor> {
    await this.validate(survivor);
    return this.survivorRepository.save(survivor);
  }

  private async validate(survivor: ISurvivorRequest): Promise<void> {
    const schema = yup.object().shape({
      name: yup.string().required('Name is required'),
      age: yup.number().required('Age is required').min(0).integer(),
      gender: yup
        .string()
        .oneOf(['male', 'female'])
        .required('Gender is required'),
      location: yup
        .object()
        .shape({
          longitude: yup.number().required('Location/Longitude is required'),
          latitude: yup.number().required('Location/Latitude is required'),
        })
        .required('Location is required'),
      inventory: yup
        .object()
        .shape({
          ak47: yup.number().integer().min(0).required('ak47 is required'),
          campbellSoup: yup
            .number()
            .integer()
            .min(0)
            .required('campbellSoup is required'),
          fijiWater: yup
            .number()
            .integer()
            .min(0)
            .required('fijiWater is required'),
          firstAidPouch: yup
            .number()
            .integer()
            .min(0)
            .required('firstAidPouch is required'),
        })
        .required(),
    });
    try {
      await schema.validate(survivor, { abortEarly: false });
    } catch (err) {
      const error = err as yup.ValidationError;
      throw new ApiError(error.errors.join(','));
    }
  }
}

export default CreateSurvivor;
