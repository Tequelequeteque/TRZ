import { Router } from 'express';
import locationController from '../controllers/Trade.controller';

const tradeRoutes = Router();

tradeRoutes.put(
  '/:survivorId/trade/:anotherSurvivorId',
  locationController.update,
);

export default tradeRoutes;
