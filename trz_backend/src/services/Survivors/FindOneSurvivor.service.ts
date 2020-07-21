import * as yup from 'yup';
import { inject, injectable } from 'tsyringe';
import ApiError from '../../Utils/ApiError';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import Survivor from '../../models/Survivor.model';

export interface IRequest {
  id: string;
}

@injectable()
class CreateSurvivor {
  constructor(
    @inject('survivorRepository')
    private survivorRepository: ISurvivorRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Survivor> {
    await this.validate(id);
    const survivor = await this.survivorRepository.findById(Number(id));
    if (!survivor) throw new ApiError('Survivor dont found', 404);
    return survivor;
  }

  private async validate(id: string): Promise<void> {
    const schema = yup.number().integer().min(0).required('Id is required!');
    try {
      await schema.validate(id, { abortEarly: false });
    } catch (err) {
      const error = err as yup.ValidationError;
      throw new ApiError(error.errors.join(','));
    }
  }
}

export default CreateSurvivor;
