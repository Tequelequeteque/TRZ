import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTableSurvivors1594161682440
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const SET_ENV = process.env.SET_ENV as string;
    await queryRunner.createTable(
      new Table({
        name: 'survivors',
        columns: [
          {
            name: 'id',
            type: 'integer',
            generationStrategy: 'increment',
            isPrimary: true,
            isGenerated: true,
            unsigned: true,
          },
          { name: 'name', type: 'varchar' },
          { name: 'age', type: 'integer', unsigned: true },
          SET_ENV === 'test'
            ? {
                name: 'gender',
                type: 'string',
              }
            : {
                name: 'gender',
                type: 'enum',
                enum: ['male', 'female'],
                enumName: 'gender',
              },
          {
            name: 'location_id',
            type: 'integer',
            unsigned: true,
          },
          {
            name: 'inventory_id',
            type: 'integer',
            unsigned: true,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'SurvivorLocationFK',
            columnNames: ['location_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'locations',
          },
          {
            name: 'SurvivorInventoryFK',
            columnNames: ['inventory_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'inventories',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('survivors');
  }
}
