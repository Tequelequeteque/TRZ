import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateSurvivor from '../services/Survivors/CreateSurvivor.service';
import FindAllSurvivor from '../services/Survivors/FindAllSurvivors.service';
import FindOneSurvivor from '../services/Survivors/FindOneSurvivor.service';

class SurvivorController {
  async create(request: Request, response: Response): Promise<Response> {
    const createSurvivor = container.resolve(CreateSurvivor);
    const storeSurvivor = await createSurvivor.execute(request.body);
    return response.status(201).json(storeSurvivor);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const createSurvivor = container.resolve(FindAllSurvivor);
    const survivors = await createSurvivor.execute();
    return response.json(survivors);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const findOneSurvivor = container.resolve(FindOneSurvivor);
    const survivors = await findOneSurvivor.execute({ id: request.params.id });
    return response.json(survivors);
  }
}

export default new SurvivorController();
