import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateReportedInfectedService from '../services/ReportedInfected/CreateReportedInfected.service';

class SurvivorController {
  async create(request: Request, response: Response): Promise<Response> {
    const { infectedSurvivorId, reportedSurvivorId } = request.params;
    const createReportedInfected = container.resolve(
      CreateReportedInfectedService,
    );
    const storeReportedInfected = await createReportedInfected.execute({
      infectedSurvivorId,
      reportedSurvivorId,
    });
    return response.status(201).json(storeReportedInfected);
  }
}

export default new SurvivorController();
