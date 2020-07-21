import { Router } from 'express';
import reportController from '../controllers/Report.controller';

const reportRoutes = Router();

reportRoutes.get('/reports', reportController.index);

export default reportRoutes;
