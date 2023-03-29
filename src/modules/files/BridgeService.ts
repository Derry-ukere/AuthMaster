import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { awsS3 } from '../../Aws';
import filesize from 'filesize';
import { StatusDto, FileDto } from '@typings/index';

export const FilesBridgeService = {
  async getFile(fileKey: string): Promise<FileDto> {
    if (!fileKey) {
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Please provide a valid file key');
    }

    const [folder, Key] = fileKey
      .split('/')
      .filter(Boolean)
      .map(str => str.trim());

    const params = {
      Bucket: `${process.env.S3_BUCKET}/${process.env.S3_FOLDER_BASE}/${folder}`,
      Key,
    };

    return new Promise((resolve, reject) => {
      awsS3().headObject(params, (err, data) => {
        if (err) {
          Logger.Error('FILE_NOT_FOUND', err.message, err.stack);

          return reject({
            code: ErrorCode.RESOURCE_NOT_FOUND,
            message: 'File does not exist in storage',
            data: err.stack,
          });
        }

        Logger.Info('File was not found in s3', data);

        return resolve({
          fileKey,
          fileSize: filesize(data.ContentLength!),
          lastModified: data.LastModified?.toString(),
          contentType: <string>data.ContentType,
        });
      });
    });
  },

  async removeFile(fileKey: string): Promise<StatusDto> {
    if (!fileKey) {
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Please provide a valid file key');
    }

    const [folder, Key] = fileKey
      .split('/')
      .filter(Boolean)
      .map(str => str.trim());

    const params = {
      Bucket: `${process.env.S3_BUCKET}/${process.env.S3_FOLDER_BASE}/${folder}`,
      Key,
    };

    return new Promise((resolve, reject) => {
      awsS3().deleteObject(params, (err, metadata) => {
        if (err) {
          Logger.Error('Unable to remove file from s3', err.message, err.stack);

          return reject({
            code: ErrorCode.SERVER_ERROR,
            message: 'Error deleting file from storage.',
          });
        }

        Logger.Info(`File -> ${fileKey} was removed from s3 storage`, metadata);

        return resolve({
          success: true,
          message: 'File was removed from storage successfully.',
        });
      });
    });
  },
};
