import { IExpressRequest } from '@middlewares/Security';
import { Response } from 'express';
import { handleErrorResponse } from '@handlers/RouteHandlers';
import { FilesService } from './FilesService';

export const FilesController = {
  async generatePresignedUrl(req: IExpressRequest, res: Response): Promise<void> {
    const { contentType, uploadType } = req.body;

    try {
      const response = await FilesService.generatePresignedUrl(contentType, uploadType);
      res.status(201).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
