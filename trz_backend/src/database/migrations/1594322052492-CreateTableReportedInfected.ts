import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTableReportedInfected1594322052492
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reported_infected',
        columns: [
          {
            name: 'infected_survivor_id',
            type: 'integer',
            unsigned: true,
            isPrimary: true,
          },
          {
            name: 'reported_survivor_id',
            type: 'integer',
            unsigned: true,
            isPrimary: true,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: 'InfectedSurvivorsFK',
            columnNames: ['infected_survivor_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'survivors',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ReportedSurvivorsFK',
            columnNames: ['reported_survivor_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'survivors',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reported_infected');
  }
}
