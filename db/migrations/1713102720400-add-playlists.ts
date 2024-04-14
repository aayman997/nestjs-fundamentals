import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlaylists1713102720400 implements MigrationInterface {
    name = 'AddPlaylists1713102720400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlists" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_a4597f4189a75d20507f3f7ef0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "playListId" integer`);
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "FK_54cf41bc33d524b206b93581950" FOREIGN KEY ("playListId") REFERENCES "playlists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlists" ADD CONSTRAINT "FK_708a919e9aa49019000d9e9b68e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlists" DROP CONSTRAINT "FK_708a919e9aa49019000d9e9b68e"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_54cf41bc33d524b206b93581950"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "playListId"`);
        await queryRunner.query(`DROP TABLE "playlists"`);
    }

}
