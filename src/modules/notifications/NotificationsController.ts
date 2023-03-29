import { handleErrorResponse } from '@handlers/RouteHandlers';
import { IExpressRequest } from '@middlewares/Security';
import { Response } from 'express';
import { NotificationsService } from './NotificationsService';

export const NotificationsController = {
  async previewEmailTemplate(req: IExpressRequest, res: Response): Promise<any> {
    try {
      const { id } = req.query;

      if (!id) {
        return res.send('No valid template Id provided');
      }

      const data = NotificationsService.previewEmailTemplate(id);

      res.send(data);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async unsubscribeEmail(req: IExpressRequest, res: Response): Promise<any> {
    try {
      res
        .status(200)
        .send(
          'Your email was unsubscribed successfully. You will only receive transactional emails from us going forward. If you would like to deactivate your account, please send an email to help@distinct.ai',
        );
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
