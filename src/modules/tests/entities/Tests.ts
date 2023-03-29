import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { applyTypeormRelations, IModelOptions, whereClauseFromObject } from '@modules/utils/typeorm';
import { TestDto } from '@typings/index';
import { TestResultEntity } from './TestResults';
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, JoinColumn, Index } from 'typeorm';
import _ from 'lodash';

const ALIAS = 'test';

class CustomEntity extends BaseEntity {
  static async addTest(data: Partial<TestEntity>): Promise<TestEntity> {
    try {
      return await TestEntity.create(data).save();
    } catch (err) {
      Logger.Error('Server error -> unable to add Test', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to add test');
    }
  }

  static async findTestsandCount(options: IModelOptions): Promise<[TestEntity[], number]> {
    const { where, skip, take, orderBy } = options;

    try {
      let qb = TestEntity.createQueryBuilder(ALIAS);
      if (!_.isEmpty(where)) {
        const { clause, parameters } = whereClauseFromObject(where, ALIAS);
        qb = TestEntity.createQueryBuilder(ALIAS).where(clause, parameters);
      }
      applyTypeormRelations(
        <any>qb,
        ALIAS,
      );
      qb = qb.skip(skip).take(take);
      if (orderBy) {
        qb.orderBy(`${ALIAS}.${orderBy.column}`, orderBy.order);
      }
      return await qb.getManyAndCount();
    } catch (err) {
      Logger.Error('Unable to fetch Tests', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Unable to get user tests.');
    }
  }
  static async findByText(options: IModelOptions, text: string): Promise<[TestEntity[], number]> {
    const { skip, take, orderBy } = options;
    try {
      const qb = TestEntity.createQueryBuilder(ALIAS)
        .select()
        .where(`MATCH(title) AGAINST ('${text}' IN BOOLEAN MODE)`)
        .orWhere(`MATCH(description) AGAINST ('${text}' IN BOOLEAN MODE)`)
        .skip(skip).take(take);
      if (orderBy) {
        qb.orderBy(`${ALIAS}.${orderBy.column}`, orderBy.order);
      }
      return await qb.getManyAndCount();
    } catch (err) {
      Logger.Error('Unable to fetch Tests', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Unable to get user tests.');
    }
  }
  static async findTest(options: IModelOptions): Promise<TestEntity | undefined> {
    const { clause, parameters } = whereClauseFromObject(options.where, ALIAS);
    try {
      return await TestEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getOne();
    } catch (err) {
      Logger.Error('Server error -> Unable to find a Test', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server Error -> Unable to find a Test');
    }
  }
  static async updateTest(update: Partial<TestEntity>, options: IModelOptions): Promise<boolean> {
    const { clause, parameters } = whereClauseFromObject(options.where);
    try {
      const updated = await TestEntity.createQueryBuilder()
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
}

@Entity('tests')
export class TestEntity extends CustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  userId!: string;

  @Column({ type: 'varchar', nullable: true })
  jobId!: string;

  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 30 })
  title!: string;

  @Index({ fulltext: true })
  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  instructions!: string;

  @Column({ type: 'integer' })
  durationValue!: number;

  @Column({ type: 'enum', enum: TestDto.type })
  durationType!: TestDto.type;

  @OneToMany(() => TestResultEntity, (result) => result.testId,
    { eager: true }
  )

  @JoinColumn({ name: 'testId' })
  testResults!: TestResultEntity[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
