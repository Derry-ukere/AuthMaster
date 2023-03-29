/* eslint-disable quotes */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestingMigration1664886992657 implements MigrationInterface {
  name = 'TestingMigration1664886992657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `testing_test_results` (`id` varchar(36) NOT NULL, `userId` varchar(255) NOT NULL, `testId` varchar(255) NOT NULL, `applicationId` varchar(255) NOT NULL, `passed` int NOT NULL, `total` int NOT NULL, `status` enum ('IN_PROGRESS', 'COMPLETED') NOT NULL, `expiresIn` int NOT NULL, `score` int NOT NULL, `completedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `tests` (`id` varchar(36) NOT NULL, `userId` varchar(255) NULL, `jobId` varchar(255) NULL, `title` varchar(30) NOT NULL, `description` text NOT NULL, `instructions` text NOT NULL, `durationValue` int NOT NULL, `durationType` enum ('MINUTES', 'HOURS') NOT NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), FULLTEXT INDEX `IDX_12a8ad98a94a8442d195bd9ecc` (`title`), FULLTEXT INDEX `IDX_d74076ec1320481fb63a3ec2ef` (`description`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `testing_proctors` (`id` varchar(36) NOT NULL, `resultId` varchar(255) NULL, `userId` varchar(255) NOT NULL, `fileKey` varchar(255) NOT NULL, `fileName` varchar(255) NOT NULL, `url` varchar(255) NOT NULL, `type` enum ('AUDIO', 'IMAGE') NOT NULL, `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `testing_proctors`');
    await queryRunner.query('DROP INDEX `IDX_d74076ec1320481fb63a3ec2ef` ON `tests`');
    await queryRunner.query('DROP INDEX `IDX_12a8ad98a94a8442d195bd9ecc` ON `tests`');
    await queryRunner.query('DROP TABLE `tests`');
    await queryRunner.query('DROP TABLE `testing_test_results`');
  }
}
