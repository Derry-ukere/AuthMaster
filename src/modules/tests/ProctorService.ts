import { v4 as uuidv4 } from 'uuid';
import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { StatusDto } from '@typings/index';
import { Logger } from '@helpers/Logger';
import { ProctorEntity } from '@modules/tests/entities';

export const ProctorService = {
  async addProctor(userId: string, resultId: string, fileType: string, fileKey: string, url: string): Promise<StatusDto> {
    const proctorEntity = {
      id: uuidv4(),
      userId,
      resultId,
      fileType,
      fileKey,
      url
    };

    try {
      await ProctorEntity.addProctor(proctorEntity);
      return {
        success: true,
        message: 'success'
      };
    } catch (error) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to create Proctor');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'something went worng');
    }
  },
};
