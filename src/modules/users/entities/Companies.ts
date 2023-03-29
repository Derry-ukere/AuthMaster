import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { IModelOptions, whereClauseFromObject } from '@modules/utils/typeorm';
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

const ALIAS = 'comp';

class CustomEntity extends BaseEntity {
  static async addCompany(data: Partial<CompaniesEntity>): Promise<CompaniesEntity> {
    try {
      return await CompaniesEntity.create(data).save();
    } catch (err) {
      Logger.Error('Server error -> Unable to add company', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to add company');
    }
  }

  static async findCompany(options: IModelOptions): Promise<CompaniesEntity | undefined> {
    const { clause, parameters } = whereClauseFromObject(options.where, ALIAS);

    try {
      return await CompaniesEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getOne();
    } catch (err) {
      Logger.Error('Server error -> Unable to find company.', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> Unable to find company');
    }
  }

  static async updateCompany(update: Partial<CompaniesEntity>, options: IModelOptions): Promise<boolean> {
    const { clause, parameters } = whereClauseFromObject(options.where);

    try {
      const updated = await CompaniesEntity.createQueryBuilder()
        .update()
        .set(update)
        .where(clause, parameters)
        .execute();

      return (updated.affected || 0) >= 1;
    } catch (err) {
      Logger.Error('Server error -> unable to update company', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to update company');
    }
  }
}

@Entity('user_companies')
export class CompaniesEntity extends CustomEntity {
  @Column('varchar', { primary: true, unique: true })
  id!: string;

  @Column('varchar')
  ownerId!: string;

  @Column('varchar', { nullable: true })
  name!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  alias!: string;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  email!: string;

  @Column('varchar', { nullable: true, comment: 'Company logo' })
  logo!: string;

  @Column('text', { nullable: true })
  bio!: string;

  @Column('varchar', { nullable: true })
  size!: string;

  @Column('varchar', { nullable: true })
  industry!: string;

  @Column('varchar', { nullable: true })
  locations!: string;

  @Column('varchar', { nullable: true })
  website!: string;

  @Column('varchar', { nullable: true })
  linkedIn!: string;

  @Column('varchar', { nullable: true })
  instagram!: string;

  @Column('varchar', { nullable: true })
  twitter!: string;

  @Column('varchar', { nullable: true })
  facebook!: string;

  @Column('varchar', { nullable: true })
  glassdoor!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
