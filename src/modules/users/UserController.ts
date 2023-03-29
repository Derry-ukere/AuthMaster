import { ErrorCode } from '@constants/ErrorCodes';
import { handleErrorResponse } from '@handlers/RouteHandlers';
import { CustomError } from '@helpers/CustomError';
import { IExpressRequest } from '@middlewares/Security';
import { Response } from 'express';
import { TokenActionTypes } from './constants';
import { UserService } from './UserService';

export const UserController = {
  async signup(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const response = await UserService.signup(req.body);
      res.status(201).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async signin(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const response = await UserService.signin(req.body);
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async confirmEmail(req: IExpressRequest, res: Response): Promise<void> {
    try {
      if (req.auth?.data?.actionType !== TokenActionTypes.EMAIL_VERIFICATION) {
        throw new CustomError(ErrorCode.BAD_REQUEST, 'Your token is not valid for this request');
      }

      const response = await UserService.confirmEmail(req.auth.data.userId, req.auth.data.userType);
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async requestPasswordReset(req: IExpressRequest, res: Response): Promise<void> {
    try {
      //
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async requestPasswordChange(req: IExpressRequest, res: Response): Promise<void> {
    try {
      //
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
