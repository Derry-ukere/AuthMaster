import { Validator } from '@handlers/validator';
import { UserTypes } from '@typings/index';
import { body } from 'express-validator';

export const validateUserSignup = () =>
  Validator.validate([
    body('type', 'Please select an account type')
      .custom((type: string) => type in UserTypes)
      .trim(),
    body('firstName', 'Please provide your first name')
      .isLength({ min: 3, max: 30 })
      .trim(),
    body('lastName', 'User lastname is required.')
      .isLength({ min: 3, max: 30 })
      .trim(),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('phoneNumber')
      .optional()
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number. E.g. +234 804 123 4567'),
    body('password', 'Please provide a password. Passwords can only be between 5 and 16 characters long.').isLength({ min: 5, max: 16 }),
  ]);

export const validateUserSignin = () =>
  Validator.validate([
    body('email', 'A valid email is required.').isEmail(),
    body('password', 'A password is required.').isLength({ min: 5, max: 16 }),
  ]);

export const validatePasswordReset = () => Validator.validate([body('email', 'A valid email address is required').isEmail()]);

export const validatePasswordChange = () => Validator.validate([body('password', 'A password is required.').isLength({ min: 5, max: 16 })]);
