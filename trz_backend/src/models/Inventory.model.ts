import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

interface IPoints {
  fijiWater: number;
  campbellSoup: number;
  firstAidPouch: number;
  ak47: number;
}

@Entity('inventories')
class Inventory {
  @PrimaryGeneratedColumn('increment', { type: 'integer' })
  id?: number;

  @Column({ name: 'fiji_water', type: 'integer' })
  fijiWater: number;

  @Column({ name: 'campbell_soup', type: 'integer' })
  campbellSoup: number;

  @Column({ name: 'first_aid_pouch', type: 'integer' })
  firstAidPouch: number;

  @Column({ name: 'ak47', type: 'integer' })
  ak47: number;

  @CreateDateColumn({ name: 'created_at', default: new Date() })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', default: new Date() })
  updatedAt?: Date;

  static get points(): IPoints {
    return {
      fijiWater: 14,
      campbellSoup: 12,
      firstAidPouch: 10,
      ak47: 8,
    };
  }
}

export default Inventory;
