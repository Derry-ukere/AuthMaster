import { handleErrorResponse } from '@handlers/RouteHandlers';
import { IExpressRequest } from '@middlewares/Security';
import { TestStatusDto } from '@typings/index';
import { Response } from 'express';
import { TestResultsService } from './TestResultsService';
import { TestsService } from './TestsService';
import { ProctorService } from './ProctorService';

export const TestController = {
  async getAllTests(req: IExpressRequest, res: Response): Promise<void> {
    try {
      if (!req.userId?.startsWith('company-user-')) {
        res.status(403).send({
          message: 'Bad request'
        });
      }
      const { page = 1, size = 20, text } = req.query;
      const response = await TestsService.getAllTests({
        page, size, text
      });
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  async createTest(req: IExpressRequest, res: Response): Promise<void> {
    try {
      if (!req.userId?.startsWith('company-user-')) {
        res.status(403).send({
          message: 'Bad request'
        });
      }
      const response = await TestsService.createTest(req.userId!, req.body);
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  async getTestResult(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const { page = 1, size = 20 } = req.query;
      const { id } = req.params;
      const response = await TestResultsService.getTestResult(id, page, size);
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  async getAttachTests(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const { page = 1, size = 20, resource } = req.query;
      const response = await TestsService.getAllTests({
        jobId: resource,
        page,
        size
      });
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  async attachTest(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const { id, reference, state } = req.body;
      const response = await TestsService.updateTest({
        id,
        reference,
        state
      });
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  async getScheduledTest(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const { page = 1, size = 20 } = req.query;
      const response = await TestsService.getScheduledTests(req.userId!, page, size);
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  async startTest(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await TestResultsService.createResult(id, 3600);
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  async endTest(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { resultId } = req.body;
      const response = await TestResultsService.updateResult({ id: resultId, testId: id, status: TestStatusDto.COMPLETED });
      res.status(200).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  async restartTest(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await TestResultsService.updateResult({ id, status: TestStatusDto.IN_PROGRESS });
      res.status(200).json({
        success: true,
        message: 'success'
      });
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  async addProctor(req: IExpressRequest, res: Response): Promise<void> {
    try {
      if (req.userId?.startsWith('candidate-')) {
        const { resultId, file: { type, fileKey, url } } = req.body;
        await ProctorService.addProctor(req.userId, resultId, type, fileKey, url);
        res.status(200).json({
          success: true,
          message: 'success'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Bad Request'
        });
      }
    } catch (err) {
      handleErrorResponse(err, res);
    }
  }
};
