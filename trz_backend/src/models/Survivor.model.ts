import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
} from 'typeorm';

import Location from './Location.model';
import Inventory from './Inventory.model';
import ReportedInfected from './ReportedInfected.model';

const SET_ENV = process.env.SET_ENV as string;

@Entity('survivors')
class Survivor {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id?: number;

  @Column()
  name: string;

  @Column({ type: 'integer' })
  age: number;

  @Column(
    SET_ENV === 'test'
      ? {}
      : { type: 'enum', enumName: 'gender', enum: ['male', 'female'] },
  )
  gender: 'male' | 'female';

  @OneToOne(() => Location, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'location_id', referencedColumnName: 'id' })
  location: Location;

  @OneToOne(() => Inventory, {
    eager: true,
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'inventory_id', referencedColumnName: 'id' })
  inventory: Inventory;

  @OneToMany(() => ReportedInfected, report => report.infectedSurvivorId, {
    eager: true,
  })
  @JoinColumn({ name: 'infected_survivor_id', referencedColumnName: 'id' })
  reported: ReportedInfected[];

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt?: Date;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  private setInfected() {
    this.infected = this.reported?.length > 4;
  }

  infected = false;
}

export default Survivor;
