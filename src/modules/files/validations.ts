import mime from 'mime-types';
import { Validator } from '@handlers/validator';
import { PresignedUrlDto } from '@typings/index';
import { body } from 'express-validator';

export const validateGeneratePresignedUrl = () => {
  return Validator.validate([
    body('contentType').custom((type: string) => mime.extension(type)),
    body('uploadType').custom((type: string) => type in PresignedUrlDto.uploadType),
  ]);
};
