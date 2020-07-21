import { container } from 'tsyringe';
import ISurvivorRepository from '../repositories/Survivor/ISurvivor.repository';
import SurvivorRepository from '../repositories/Survivor/Survivor.repository';

container.registerSingleton<ISurvivorRepository>(
  'survivorRepository',
  SurvivorRepository,
);
