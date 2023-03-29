import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { IModelOptions, whereClauseFromObject } from '@modules/utils/typeorm';
import { CandidateDto } from '@typings/index';
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

const ALIAS = 'cand';

class CustomEntity extends BaseEntity {
  static async addCandidate(data: Partial<CandidatesEntity>): Promise<CandidatesEntity> {
    try {
      return await CandidatesEntity.create(data).save();
    } catch (err) {
      Logger.Error('Server error -> Unable to add candidate', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to add candidate');
    }
  }

  static async findCandidate(options: IModelOptions): Promise<CandidatesEntity | undefined> {
    const { clause, parameters } = whereClauseFromObject(options.where, ALIAS);

    try {
      return await CandidatesEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getOne();
    } catch (err) {
      Logger.Error('Server error -> Unable to find candidate.', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> Unable to find candidate');
    }
  }

  static async updateCandidate(update: Partial<CandidatesEntity>, options: IModelOptions): Promise<boolean> {
    const { clause, parameters } = whereClauseFromObject(options.where);

    try {
      const updated = await CandidatesEntity.createQueryBuilder()
        .update()
        .set(update)
        .where(clause, parameters)
        .execute();

      return (updated.affected || 0) >= 1;
    } catch (err) {
      Logger.Error('Server error -> unable to update candidate', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to update candidate');
    }
  }
}

@Entity('user_candidates')
export class CandidatesEntity extends CustomEntity {
  @Column('varchar', { primary: true, unique: true })
  id!: string;

  @Column({ type: 'varchar', length: 30 })
  firstName!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  middleName!: string;

  @Column({ type: 'varchar', length: 30 })
  lastName!: string;

  @Column({ type: 'varchar', length: 30, nullable: true, unique: true })
  phoneNumber!: string;

  @Column('varchar')
  password!: string;

  @Column('varchar', { nullable: true })
  photo!: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email!: string;

  @Column('varchar', { nullable: true })
  dob!: string;

  @Column('varchar', { nullable: true })
  salaryCurrency!: string;

  @Column('varchar', { nullable: true })
  salaryCurrent!: string;

  @Column('varchar', { nullable: true })
  salaryDesired!: string;

  @Column('varchar', { nullable: true })
  jobPreferredLocation!: CandidateDto.jobLocation;

  @Column('boolean', { default: false })
  confirmedEmail!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
