import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateLocation from '../services/Locations/UpdateLocation.service';

class LocationController {
  async update(request: Request, response: Response): Promise<Response> {
    const { survivorId } = request.params;
    const { location } = request.body;
    const updateLocation = container.resolve(UpdateLocation);
    const storeLocation = await updateLocation.execute({
      survivorId,
      location,
    });
    return response.json(storeLocation);
  }
}

export default new LocationController();
