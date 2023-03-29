import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { JobDto, Timestamp } from '@typings/index';
import { applyTypeormRelations, IModelOptions, whereClauseFromObject } from '@modules/utils/typeorm';
import { BaseEntity, Column, CreateDateColumn, OneToMany, Entity, JoinColumn, UpdateDateColumn, PrimaryGeneratedColumn, getRepository, DeleteResult } from 'typeorm';
import { BenefitsEntity } from './Benefits';

const ALIAS = 'jobs';
type relations = 'benefits';

class CustomEntity extends BaseEntity {
  static async addJob(data: Partial<JobsEntity>): Promise<JobsEntity> {
    try {
      return await JobsEntity.create(data).save();
    } catch (err) {
      Logger.Error('Server error -> Unable to add Job', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to add Job');
    }
  }

  static async findJob(options: IModelOptions): Promise<JobsEntity | undefined> {
    const { clause, parameters } = whereClauseFromObject(options.where, ALIAS);

    try {
      return await JobsEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getOne();
    } catch (err) {
      Logger.Error('Server error -> Unable to find Job.', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> Unable to find Job');
    }
  }

  static async findJobsAndCount(options: IModelOptions<relations>): Promise<[JobsEntity[], number]> {
    const { where, include = [], skip, take, orderBy } = options;
    const { clause, parameters } = whereClauseFromObject(where, ALIAS);


    try {
      let qb = JobsEntity.createQueryBuilder(ALIAS).where(clause, parameters);

      applyTypeormRelations(
        <any>qb,
        ALIAS,
        include.map(str => {
          if (str === 'benefits') {
            return {
              key: 'benefits',
              entity: JobsEntity,
              mapType: 'many',
            };
          }

          return str;
        }),
        'description',
      );

      qb = qb.skip(skip).take(take);

      if (orderBy) {
        qb.orderBy(`${ALIAS}.${orderBy.column}`, orderBy.order);
      }

      return await qb.getManyAndCount();
    } catch (err) {
      Logger.Error('Unable to fetch jobs.', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Unable to get user jobs.');
    }
  }

  static async findJobs(options: IModelOptions): Promise<JobsEntity[]> {
    const { where } = options;
    const { clause, parameters } = whereClauseFromObject(where, ALIAS);

    try {
      return await JobsEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getMany();
    } catch (err) {
      Logger.Error('(TypeORM) Error finding jobs.');
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Typeorm error: Unable to get jobs.');
    }
  }

  static async updateJob(update: Partial<JobsEntity>, options: IModelOptions): Promise<boolean> {
    const { clause, parameters } = whereClauseFromObject(options.where);

    try {
      const updated = await JobsEntity.createQueryBuilder()
        .update()
        .set(update)
        .where(clause, parameters)
        .execute();

      return (updated.affected || 0) >= 1;
    } catch (err) {
      Logger.Error('Server error -> unable to update Job', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to update Job');
    }
  }

  static async deleteJob(id: string): Promise<DeleteResult> {
    try {
      const jobsRepository = getRepository(JobsEntity);
      return jobsRepository.delete(id);
    } catch (err) {
      Logger.Error('Server error -> unable to delete Job', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to delete Job');
    }
  }
}

@Entity('jobs')
export class JobsEntity extends CustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  userId!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar', })
  description!: string;

  @Column({ type: 'varchar', })
  jobType!: JobDto.jobType;

  @Column({ type: 'varchar', })
  yearsOfExperience!: string;

  @Column({ type: 'varchar', default: JobDto.status.DRAFTS })
  status!: JobDto.status;

  @Column({ type: 'varchar', })
  skills!: string;

  @Column({ type: 'varchar', })
  qualifications!: string;

  @Column({ type: 'varchar', })
  preferredLocation!: string;

  @Column({ type: 'varchar', })
  jobLocation!: string;

  @Column({ type: 'varchar', })
  currency!: string;

  @Column({ type: 'varchar', })
  salaryRangeFrom!: number;

  @Column({ type: 'varchar', })
  salaryRangeTo!: number;

  @OneToMany(() => BenefitsEntity, (benefit) => benefit.jobId,
    { eager: true },
  )
  @JoinColumn({ name: 'jobId' })
  benefits!: BenefitsEntity[]

  @CreateDateColumn({ type: 'timestamp' })
  deadlineAt!: Timestamp;

  @CreateDateColumn({ type: 'timestamp' })
  publishedAt!: Timestamp;

  @CreateDateColumn({ type: 'timestamp' })
  closedAt!: Timestamp;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Timestamp;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Timestamp;
}
