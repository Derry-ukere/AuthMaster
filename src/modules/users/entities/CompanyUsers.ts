import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { IModelOptions, whereClauseFromObject } from '@modules/utils/typeorm';
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

const ALIAS = 'comp_user';

class CustomEntity extends BaseEntity {
  static async addUser(data: Partial<CompanyUserEntity>): Promise<CompanyUserEntity> {
    try {
      return await CompanyUserEntity.create(data).save();
    } catch (err) {
      Logger.Error('Server error -> Unable to add company user', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to add company user');
    }
  }

  static async findUser(options: IModelOptions): Promise<CompanyUserEntity | undefined> {
    const { clause, parameters } = whereClauseFromObject(options.where, ALIAS);

    try {
      return await CompanyUserEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getOne();
    } catch (err) {
      Logger.Error('Server error -> Unable to find company user.', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> Unable to find company user');
    }
  }

  static async updateUser(update: Partial<CompanyUserEntity>, options: IModelOptions): Promise<boolean> {
    const { clause, parameters } = whereClauseFromObject(options.where);

    try {
      const updated = await CompanyUserEntity.createQueryBuilder()
        .update()
        .set(update)
        .where(clause, parameters)
        .execute();

      return (updated.affected || 0) >= 1;
    } catch (err) {
      Logger.Error('Server error -> unable to update company user', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to update company user');
    }
  }
}

@Entity('user_company_users')
export class CompanyUserEntity extends CustomEntity {
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

  @Column('boolean', { default: false })
  confirmedEmail!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
