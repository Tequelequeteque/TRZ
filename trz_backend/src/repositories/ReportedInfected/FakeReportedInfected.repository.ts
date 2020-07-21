import ReportInfected from '../../models/ReportedInfected.model';
import IReportedInfectedRepository from './IReportedInfected.repository';
import { IReportedInfectedDTO } from '../../services/ReportedInfected/CreateReportedInfected.service';
import ISurvivorRepository from '../Survivor/ISurvivor.repository';

class FakeReportedInfectedRepository implements IReportedInfectedRepository {
  private lastId = 1;

  constructor(private fakeSurvivorRepository: ISurvivorRepository) {}

  public async save(
    infectedReport: IReportedInfectedDTO,
  ): Promise<ReportInfected> {
    const id = this.lastId;
    this.lastId += 1;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const newInfectedReport = Object.assign(new ReportInfected(), {
      ...infectedReport,
      id,
      createdAt,
      updatedAt,
    });
    const survivor = await this.fakeSurvivorRepository.findById(
      infectedReport.infectedSurvivorId,
    );
    if (survivor) {
      survivor.reported.push(newInfectedReport);
      survivor.infected = survivor.reported.length > 4;
    }
    return Promise.resolve(newInfectedReport);
  }
}

export default FakeReportedInfectedRepository;
