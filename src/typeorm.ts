/* istanbul ignore file */
import 'reflect-metadata';
import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import { CandidatesEntity, CompaniesEntity, CompanyUserEntity, CompanyTeamsEntity } from '@modules/users/entities';
import { BenefitsEntity, JobsEntity } from '@modules/jobs/entities';

import { migrations } from './migrations/index';
import { TestEntity, TestResultEntity, ProctorEntity } from '@modules/tests/entities';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

const connectionOpts: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // prettier-ignore
  entities: [
    // prettier-ignore
    BenefitsEntity, JobsEntity,
    // prettier-ignore
    CandidatesEntity, CompaniesEntity, CompanyUserEntity, CompanyTeamsEntity,
    // prettier-ignore
    TestEntity, TestResultEntity, ProctorEntity
  ],
  synchronize: true,
  logging: isDev,
  migrationsRun: true,
  // prettier-ignore
  migrations,
  cli: { migrationsDir: './src/migrations' },
  charset: 'utf8mb4_unicode_ci',
};

export = connectionOpts;
