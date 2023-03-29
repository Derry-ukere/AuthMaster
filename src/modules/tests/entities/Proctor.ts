import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { IModelOptions, whereClauseFromObject } from '@modules/utils/typeorm';
import { ProctorFileDto } from '@typings/index';
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

const ALIAS = 'proctor';

class CustomEntity extends BaseEntity {
  static async findProctor(options: IModelOptions): Promise<ProctorEntity | undefined> {
    const { clause, parameters } = whereClauseFromObject(options.where, ALIAS);
    try {
      return await ProctorEntity.createQueryBuilder(ALIAS)
        .where(clause, parameters)
        .getOne();
    } catch (err) {
      Logger.Error('Server error -> Unable to find a Proctor', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> Unable to find a Proctor');
    }
  }
  static async addProctor(data: Partial<ProctorEntity>): Promise<ProctorEntity> {
    try {
      return await ProctorEntity.create(data).save();
    } catch (err) {
      Logger.Error('Server error -> Unable to add Proctor', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to add Proctor');
    }
  }
}

@Entity('testing_proctors')
export class ProctorEntity extends CustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  resultId!: string;

  @Column({ type: 'varchar' })
  userId!: string;

  @Column({ type: 'varchar' })
  fileKey!: string;

  @Column({ type: 'varchar' })
  fileName!: string;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ type: 'enum', enum: ProctorFileDto.type })
  type!: ProctorFileDto.type;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
