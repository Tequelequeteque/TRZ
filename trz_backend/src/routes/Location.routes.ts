import { Router } from 'express';
import locationController from '../controllers/Location.controller';

const survivorRoutes = Router();

survivorRoutes.put('/:survivorId/locations', locationController.update);

export default survivorRoutes;
