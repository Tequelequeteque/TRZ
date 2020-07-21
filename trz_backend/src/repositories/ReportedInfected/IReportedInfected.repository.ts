import ReportInfected from '../../models/ReportedInfected.model';
import { IReportedInfectedDTO } from '../../services/ReportedInfected/CreateReportedInfected.service';

export default interface IReportedInfectedRepository {
  save(InfectedReport: IReportedInfectedDTO): Promise<ReportInfected>;
}
