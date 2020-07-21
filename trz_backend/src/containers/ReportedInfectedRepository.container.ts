import { container } from 'tsyringe';
import IReportInfectedRepository from '../repositories/ReportedInfected/IReportedInfected.repository';
import ReportInfected from '../repositories/ReportedInfected/ReportedInfected.repository';

container.registerSingleton<IReportInfectedRepository>(
  'reportInfectedRepository',
  ReportInfected,
);
