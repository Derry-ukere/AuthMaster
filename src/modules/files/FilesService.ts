import { v4 as uuid4 } from 'uuid';
import mime from 'mime-types';
import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { PresignedUrlGeneratedDto, PresignedUrlDto } from '@typings/index';
import { Logger } from '@helpers/Logger';
import { awsS3 } from '../../Aws';

export const FilesService = {
  folderFromUploadType(uploadType: PresignedUrlDto.uploadType): string {
    switch (uploadType) {
      case PresignedUrlDto.uploadType.PHOTOS:
        return <string>process.env.S3_FOLDER_PHOTOS;
      case PresignedUrlDto.uploadType.CV:
        return <string>process.env.S3_FOLDER_CVS;
      case PresignedUrlDto.uploadType.PROCTOR:
        return <string>process.env.S3_FOLDER_PROCTOR;
      default: {
        throw new CustomError(ErrorCode.SERVER_ERROR, 'Invalid upload type passed.');
      }
    }
  },
  async generatePresignedUrl(contentType: string, uploadType: PresignedUrlDto.uploadType): Promise<PresignedUrlGeneratedDto> {
    const folder = this.folderFromUploadType(uploadType);
    const Bucket = `${process.env.S3_BUCKET}/${process.env.S3_FOLDER_BASE}/${folder}`;
    const fileExtension = mime.extension(contentType);

    if (!fileExtension) {
      throw new CustomError(ErrorCode.BAD_REQUEST, 'Invalid content type passed', { contentType });
    }

    const params = {
      Bucket,
      Key: `${uuid4()}.${fileExtension}`,
      Expires: 300,
      ACL: 'public-read',
      ContentType: contentType,
    };

    try {
      const signedUrl = await awsS3().getSignedUrlPromise('putObject', params);

      Logger.Info('GENERATED_PRESIGNED_URL', signedUrl);

      return {
        success: true,
        message: 'AWS SDK S3 Pre-signed urls generated successfully.',
        signedUrl,
        fileKey: `${folder}/${params.Key}`,
        fileUrl: `https://${process.env.S3_BUCKET}/${process.env.S3_FOLDER_BASE}/${folder}/${params.Key}`,
      };
    } catch (err) {
      Logger.Error('Aws s3 presigned url generation failed', err.message, err.stack);
      throw new CustomError(ErrorCode.SERVER_ERROR, 'Your file could not be uploaded');
    }
  },
};
