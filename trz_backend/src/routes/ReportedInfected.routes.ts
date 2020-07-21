import { Router } from 'express';
import infectedReportController from '../controllers/InfectedReport.controller';

const survivorRoutes = Router();

survivorRoutes.post(
  '/:reportedSurvivorId/reportedInfected/:infectedSurvivorId',
  infectedReportController.create,
);

export default survivorRoutes;
