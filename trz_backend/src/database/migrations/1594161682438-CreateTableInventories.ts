import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTableInventories1594161682438
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'inventories',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'fiji_water',
            type: 'integer',
            default: 0,
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'campbell_soup',
            type: 'integer',
            default: 0,
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'first_aid_pouch',
            type: 'integer',
            default: 0,
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'ak47',
            type: 'integer',
            default: 0,
            unsigned: true,
            isNullable: false,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('inventories');
  }
}
