import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Survivor from './Survivor.model';

@Entity('reported_infected')
class ReportInfected {
  @ManyToOne(() => Survivor, survivor => survivor.reported)
  @JoinColumn({ name: 'infected_survivor_id', referencedColumnName: 'id' })
  @PrimaryColumn({ name: 'infected_survivor_id' })
  infectedSurvivorId: number;

  @PrimaryColumn({ name: 'reported_survivor_id' })
  reportedSurvivorId: number;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt?: Date;
}

export default ReportInfected;
