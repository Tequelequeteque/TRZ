import { Router } from 'express';
import survivorController from '../controllers/Survivor.controller';

const survivorRoutes = Router();

survivorRoutes.post('/', survivorController.create);
survivorRoutes.get('/', survivorController.index);
survivorRoutes.get('/:id', survivorController.show);

export default survivorRoutes;
