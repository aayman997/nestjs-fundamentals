import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPhone1713101389151 implements MigrationInterface {
  name = 'AddUserPhone1713101389151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users"
        ADD "phone" character varying NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users"
        DROP COLUMN "phone"`);
  }
}
