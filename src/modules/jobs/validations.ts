import { Validator } from '@handlers/validator';
import { JobDto } from '@typings/index';
import { body } from 'express-validator';

export const validateJobcreation = () => Validator.validate([
  body('title', 'Provide a valid  Job title,')
    .isLength({ min: 3 })
    .isString()
    .exists(),
  body('description', 'Provide a valid  Job description,')
    .isLength({ min: 3 })
    .isString()
    .exists(),
  body('jobType', 'Provide a valid  Job jobType,')
    .custom((type: string) => type in JobDto.jobType)
    .exists(),
  body('yearsOfExperience', 'Provide a valid  years Of Experience,')
    .isString()
    .exists(),
  body('skills', 'Provide a valid  Job skills,')
    .isArray()
    .exists(),
  body('qualifications', 'Provide a valid  Job qualifications,')
    .isArray()
    .exists(),
  body('preferredLocation', 'Provide a valid  Job preferredLocation,')
    .isArray()
    .exists(),
  body('jobLocation', 'Provide a valid  Job location,')
    .isArray()
    .exists(),
  body('salary.currency', 'Provide a valid  salary cureency,')
    .exists()
    .isString(),
  body('salary.rangeTo', 'Provide a valid  salary range,')
    .exists()
    .isNumeric(),  
  body('salary.rangeFrom', 'Provide a valid  salary range,')
    .exists()
    .isNumeric(),  
  body('salary.benefits', 'Provide a valid  salary benefits,')
    .exists()
    .custom((type: string) => type in JobDto.benefits) 
]);

export const validateJobupdate = () => Validator.validate([
  body('title', 'Provide a valid  Job title,')
    .isLength({ min: 3 })
    .isString()
    .optional(),
  body('description', 'Provide a valid  Job description,')
    .isLength({ min: 3 })
    .isString()
    .optional(),
  body('jobType', 'Provide a valid  Job jobType,')
    .custom((type: string) => type in JobDto.jobType)
    .exists(),
  body('yearsOfExperience', 'Provide a valid  years Of Experience,')
    .isString()
    .optional(),
  body('skills', 'Provide a valid  Job skills,')
    .isArray()
    .optional(),
  body('qualifications', 'Provide a valid  Job qualifications,')
    .isArray()
    .optional(),
  body('preferredLocation', 'Provide a valid  Job preferredLocation,')
    .isArray()
    .optional(),
  body('jobLocation', 'Provide a valid  Job location,')
    .isArray()
    .optional(),
  body('salary.currency', 'Provide a valid  salary cureency,')
    .optional()
    .isString(),
  body('salary.rangeTo', 'Provide a valid  salary range,')
    .optional()
    .isNumeric(),  
  body('salary.rangeFrom', 'Provide a valid  salary range,')
    .optional()
    .isNumeric(),  
  body('salary.benefits', 'Provide a valid  salary benefits,')
    .optional()
    .custom((type: string) => type in JobDto.benefits) 
]);
