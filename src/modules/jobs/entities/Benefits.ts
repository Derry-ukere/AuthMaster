import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';


class CustomEntity extends BaseEntity {
  static async addBenefits(data: Partial<BenefitsEntity>): Promise<BenefitsEntity> {
    try {
      return await BenefitsEntity.create(data).save();
    } catch (err) {
      Logger.Error('Server error -> Unable to add Benefit', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Server error -> unable to add Benefit');
    }
  }

}


@Entity('benefits')
export class BenefitsEntity extends CustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', })
  jobId!: string

  @Column({ type: 'varchar', })
  description!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
