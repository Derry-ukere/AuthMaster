import { Validator } from '@handlers/validator';
import { TestDto } from '@typings/index';
import { body } from 'express-validator';

export const validateTestcreation = () => Validator.validate([
  body('title', 'Provide a valid title,')
    .isLength({ min: 3 })
    .isString()
    .exists(),
  body('description', 'Provide a valid description,')
    .isLength({ min: 3 })
    .isString()
    .exists(),
  body('instructions', 'Provide a valid instruction,')
    .isLength({ min: 3 })
    .isString()
    .exists(),
  body('duration.type', 'Provide a valid duration type')
    .custom((type: string) => type in TestDto.type)
    .exists(),
  body('duration.value', 'Provide a valid duration value')
    .isNumeric()
    .exists(),
]);
