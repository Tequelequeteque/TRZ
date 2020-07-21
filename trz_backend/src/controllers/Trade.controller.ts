import { Request, Response } from 'express';
import { container } from 'tsyringe';
import TradeItems from '../services/Trade/TradeItems.service';

class LocationController {
  async update(request: Request, response: Response): Promise<Response> {
    const { survivorId, anotherSurvivorId } = request.params;
    const { survivorItemsGiven, anotherSurvivorItemsGiven } = request.body;
    const tradeItems = container.resolve(TradeItems);
    const [inventory, anotherInventory] = await tradeItems.execute({
      survivorId,
      anotherSurvivorId,
      survivorItemsGiven,
      anotherSurvivorItemsGiven,
    });
    return response.json({ inventory, anotherInventory });
  }
}

export default new LocationController();
