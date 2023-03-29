import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { applyTypeormRelations, IModelOptions, whereClauseFromObject } from '@modules/utils/typeorm';
import { TestStatusDto } from '@typings/index';
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { ProctorEntity } from '@modules/tests/entities';

const ALIAS = 'testing_test_results';
type relations = 'proctors';

class CustomEntity extends BaseEntity {
  static async findResult(options: IModelOptions<relations>): Promise<[TestResultEntity[], number]> {
    const { include = [], where, skip, take, orderBy } = options;
    const { clause, parameters } = whereClauseFromObject(where, ALIAS);
    try {
      let qb = TestResultEntity.createQueryBuilder(ALIAS).where(clause, parameters);

      applyTypeormRelations(
        <any>qb,
        ALIAS,
        include.map(str => {
          if (str === 'proctors') {
            return {
              key: 'proctor',
              entity: ProctorEntity,
              mapType: 'one'
            };
          }
          return str;
        }),
      );
      qb = qb.skip(skip).take(take);

      if (orderBy) {
        qb.orderBy(`${ALIAS}.${orderBy.column}`, orderBy.order);
      }
      return await qb.getManyAndCount();
    } catch (err) {
      Logger.Error('Server error -> Unable to find Test result', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> Unable to find test results');
    }
  }
  static async addResult(data: Partial<TestResultEntity>): Promise<TestResultEntity> {
    try {
      return await TestResultEntity.create(data).save();
    } catch (err) {
      Logger.Error('Server error -> Unable to add TestResut', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to add TestResut');
    }
  }
  static async updateResult(update: Partial<TestResultEntity>, options: IModelOptions): Promise<boolean> {
    const { clause, parameters } = whereClauseFromObject(options.where);
    try {
      const updated = await TestResultEntity.createQueryBuilder()
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
  static async findTestResult(options: IModelOptions): Promise<TestResultEntity | undefined> {
    const { clause, parameters } = whereClauseFromObject(options.where, ALIAS);
    try {
      return await TestResultEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getOne();
    } catch (err) {
      Logger.Error('Server error -> Unable to find a Test', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server Error -> Unable to find a Test');
    }
  }
}

@Entity('testing_test_results')
export class TestResultEntity extends CustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  userId!: string;

  @Column({ type: 'varchar' })
  testId!: string;

  @Column({ type: 'varchar' })
  applicationId!: string;

  @Column({ type: 'integer' })
  passed!: number;

  @Column({ type: 'integer' })
  total!: number;

  @Column({ type: 'enum', enum: TestStatusDto })
  status!: TestStatusDto;

  @Column({ type: 'integer' })
  expiresIn!: number

  @OneToMany(() => ProctorEntity, (proctor) => proctor.resultId,
    { eager: true }
  )

  @JoinColumn({ name: 'resultId' })
  proctor!: ProctorEntity

  @Column({ type: 'integer' })
  score!: number;

  @CreateDateColumn({ type: 'timestamp' })
  completedAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
