import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateReportSurvivor from '../services/Reports/CreateReportSurvivor.service';

class LocationController {
  async index(_request: Request, response: Response): Promise<Response> {
    const createReportSurvivor = container.resolve(CreateReportSurvivor);
    const report = await createReportSurvivor.execute();
    return response.json(report);
  }
}

export default new LocationController();
