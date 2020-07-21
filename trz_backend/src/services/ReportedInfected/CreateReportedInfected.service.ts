import * as yup from 'yup'; // for everything
import { inject, injectable } from 'tsyringe';
import ReportedInfected from '../../models/ReportedInfected.model';
import ApiError from '../../Utils/ApiError';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import IReportedInfectedRepository from '../../repositories/ReportedInfected/IReportedInfected.repository';
import Survivor from '../../models/Survivor.model';

export interface IReportedInfectedRequest {
  infectedSurvivorId: string;
  reportedSurvivorId: string;
}

export interface IReportedInfectedDTO {
  infectedSurvivorId: number;
  reportedSurvivorId: number;
}

@injectable()
class CreateReportedInfectedService {
  constructor(
    @inject('survivorRepository')
    private survivorRepository: ISurvivorRepository,

    @inject('reportInfectedRepository')
    private reportInfectedRepository: IReportedInfectedRepository,
  ) {}

  public async execute({
    infectedSurvivorId,
    reportedSurvivorId,
  }: IReportedInfectedRequest): Promise<ReportedInfected> {
    await this.validate({ infectedSurvivorId, reportedSurvivorId });
    const infectedReportDTO = {
      infectedSurvivorId: Number(infectedSurvivorId),
      reportedSurvivorId: Number(reportedSurvivorId),
    } as IReportedInfectedDTO;
    await this.checkSurvivorReported(infectedReportDTO.reportedSurvivorId);
    await this.checkSurvivorInfected(infectedReportDTO);
    return this.reportInfectedRepository.save(infectedReportDTO);
  }

  private async validate(
    requestInfectedReport: IReportedInfectedRequest,
  ): Promise<void> {
    const schema = yup.object().shape({
      infectedSurvivorId: yup
        .number()
        .integer()
        .min(0)
        .required('survivorInfectedId is required'),
      reportedSurvivorId: yup
        .number()
        .integer()
        .min(0)
        .required('survivorReportedId is required'),
    });
    try {
      await schema.validate(requestInfectedReport, { abortEarly: false });
    } catch (err) {
      const error = err as yup.ValidationError;
      throw new ApiError(error.errors.join(','));
    }
  }

  private async existsSurvivor(
    id: number,
    errorMessage = 'Survivor dont found',
  ): Promise<Survivor> {
    const survivor = await this.survivorRepository.findById(id);
    if (!survivor) throw new ApiError(errorMessage, 404);
    return survivor;
  }

  private async checkSurvivorReported(
    survivorReportedId: number,
  ): Promise<void> {
    await this.existsSurvivor(
      survivorReportedId,
      'Survivor Reported dont found',
    );
  }

  private async checkSurvivorInfected({
    infectedSurvivorId: survivorInfectedId,
    reportedSurvivorId,
  }: IReportedInfectedDTO): Promise<void> {
    const flag = (
      await this.existsSurvivor(
        survivorInfectedId,
        'Survivor infected dont found',
      )
    ).reported.some(
      reportedInfected =>
        reportedInfected.reportedSurvivorId === reportedSurvivorId,
    );
    if (flag)
      throw new ApiError('You cant reported a same survivor twice', 422);
  }
}

export default CreateReportedInfectedService;
