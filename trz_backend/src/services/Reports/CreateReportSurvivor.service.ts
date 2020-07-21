import { inject, injectable } from 'tsyringe';
import { ITradeItems as IItemsPerSurvivor } from '../Trade/TradeItems.service';
import ISurvivorRepository from '../../repositories/Survivor/ISurvivor.repository';
import Survivor from '../../models/Survivor.model';
import Inventory from '../../models/Inventory.model';

interface IPercentage {
  percentageInfected: string;
  percentageNonInfected: string;
}

export type IResponse = IPercentage & {
  itemsPerSurvivor: IItemsPerSurvivor;
  lostPoints: number;
};

type IKey = keyof IItemsPerSurvivor;
@injectable()
class UpdateLocationService {
  private keyItems = Object.keys(Inventory.points);

  private points = Inventory.points;

  constructor(
    @inject('survivorRepository')
    private survivorRepository: ISurvivorRepository,
  ) {}

  public async execute(): Promise<IResponse> {
    const survivors = await this.survivorRepository.findAll();
    const percentage = this.calculatePercentageInfectedAndNonInfected(
      survivors,
    );
    const itemsPerSurvivor = this.calculateAverageItemPerSurvivor(
      survivors.filter(survivor => !survivor.infected),
    );
    const lostPoints = this.calculateLostPoints(
      survivors.filter(survivor => survivor.infected),
    );
    return { ...percentage, itemsPerSurvivor, lostPoints };
  }

  calculatePercentageInfectedAndNonInfected(
    survivors: Survivor[],
  ): IPercentage {
    const nonInfectedSurvivors = survivors.filter(
      survivor => !survivor.infected,
    );
    const percentageNonInfected =
      survivors.length &&
      (nonInfectedSurvivors.length / survivors.length) * 100;
    const percentageInfected = survivors.length && 100 - percentageNonInfected;
    return {
      percentageInfected: `${percentageInfected.toFixed(3).padStart(7, '0')}%`,
      percentageNonInfected: `${percentageNonInfected
        .toFixed(3)
        .padStart(7, '0')}%`,
    };
  }

  calculateAverageItemPerSurvivor(
    nonInfectedSurvivors: Survivor[],
  ): IItemsPerSurvivor {
    return this.keyItems.reduce((acc, keyItem) => {
      const totalItems = nonInfectedSurvivors.reduce(
        (sumItems, survivor) => sumItems + survivor.inventory[keyItem as IKey],
        0,
      );
      acc[keyItem as IKey] =
        nonInfectedSurvivors.length && totalItems / nonInfectedSurvivors.length;
      return acc;
    }, {} as IItemsPerSurvivor);
  }

  calculateLostPoints(infectedSurvivors: Survivor[]): number {
    return this.keyItems.reduce((lostPoints, keyItem) => {
      const lostItems = infectedSurvivors.reduce(
        (sumItems, survivor) => sumItems + survivor.inventory[keyItem as IKey],
        0,
      );
      return lostPoints + lostItems * this.points[keyItem as IKey];
    }, 0);
  }
}

export default UpdateLocationService;
