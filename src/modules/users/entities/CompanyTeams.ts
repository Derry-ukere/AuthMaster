import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { IModelOptions, whereClauseFromObject } from '@modules/utils/typeorm';
import { TeamMemberDto } from '@typings/index';
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

const ALIAS = 'comp_teams';

class CustomEntity extends BaseEntity {
  static async addManager(data: Partial<CompanyTeamsEntity>): Promise<CompanyTeamsEntity> {
    try {
      return await CompanyTeamsEntity.create(data).save();
    } catch (err) {
      Logger.Error('Server error -> Unable to add team member', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> Unable to add team member');
    }
  }

  static async findManager(options: IModelOptions): Promise<CompanyTeamsEntity | undefined> {
    const { clause, parameters } = whereClauseFromObject(options.where, ALIAS);

    try {
      return await CompanyTeamsEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getOne();
    } catch (err) {
      Logger.Error('Server error -> Unable to find team member', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> Unable to find team member');
    }
  }

  static async findManagers(options: IModelOptions): Promise<CompanyTeamsEntity[]> {
    const { where } = options;
    const { clause, parameters } = whereClauseFromObject(where, ALIAS);

    try {
      return await CompanyTeamsEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getMany();
    } catch (err) {
      Logger.Error('(TypeORM) Error finding team member.');
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Typeorm error: Unable to get team member.');
    }
  }

  static async updateManager(update: Partial<CompanyTeamsEntity>, options: IModelOptions): Promise<boolean> {
    const { clause, parameters } = whereClauseFromObject(options.where);

    try {
      const updated = await CompanyTeamsEntity.createQueryBuilder()
        .update()
        .set(update)
        .where(clause, parameters)
        .execute();

      return (updated.affected || 0) >= 1;
    } catch (err) {
      Logger.Error('Unable to update team member', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> Unable to update team member');
    }
  }

  static async removeAccountManager(options: IModelOptions): Promise<boolean> {
    const { clause, parameters } = whereClauseFromObject(options.where);

    try {
      await CompanyTeamsEntity.createQueryBuilder()
        .delete()
        .where(clause, parameters)
        .execute();

      return true;
    } catch (err) {
      Logger.Error('Server error -> unable to remove manager', err);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to remove manager.');
    }
  }
}

@Entity('user_company_teams')
export class CompanyTeamsEntity extends CustomEntity {
  @Column('varchar', { primary: true, unique: true })
  id!: string;

  @Column('varchar')
  ownerId!: string;

  @Column('varchar')
  invitedBy!: string;

  @Column('varchar', { nullable: true })
  userId!: string;

  @Column('varchar', { default: TeamMemberDto.status.PENDING })
  status!: TeamMemberDto.status;

  @Column({ type: 'varchar', length: 30 })
  firstName!: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  middleName!: string;

  @Column({ type: 'varchar', length: 30 })
  lastName!: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 80 })
  password!: string;

  @Column({ type: 'varchar', length: 30 })
  phone!: string;

  @Column('varchar', { nullable: true })
  role!: string;

  @Column('varchar', { nullable: true })
  permissions!: string;

  @Column('timestamp', { nullable: true })
  lastActiveAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
