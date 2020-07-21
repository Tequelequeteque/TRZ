import { Router } from 'express';
import SurvivorRoutes from './Survivor.routes';
import ReportedInfectedRoutes from './ReportedInfected.routes';
import LocationRoutes from './Location.routes';
import TradeRoutes from './Trade.routes';
import ReportRoutes from './Report.routes';

const routes = Router();

routes.use(
  '/survivors',
  ReportRoutes,
  SurvivorRoutes,
  LocationRoutes,
  TradeRoutes,
  ReportedInfectedRoutes,
);

export default routes;
