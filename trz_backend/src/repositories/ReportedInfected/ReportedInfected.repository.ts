import { getRepository } from 'typeorm';
import ReportedInfected from '../../models/ReportedInfected.model';
import IReportedInfectedRepository from './IReportedInfected.repository';
import { IReportedInfectedDTO } from '../../services/ReportInfected/CreateReportInfected.service';

class ReportedInfectedRepository implements IReportedInfectedRepository {
  private infectedReportRepository = getRepository(ReportedInfected);

  public async save(
    infectedReport: IReportedInfectedDTO,
  ): Promise<ReportedInfected> {
    const newInfectedReport = this.infectedReportRepository.create(
      infectedReport,
    );
    return this.infectedReportRepository.save(newInfectedReport);
  }
}

export default ReportedInfectedRepository;
