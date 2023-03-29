import { handleErrorResponse } from '@handlers/RouteHandlers';
import { IExpressRequest } from '@middlewares/Security';
import { Response } from 'express';
import { JobService } from './JobService';

export const JobsController = {
  async createJob(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const response = await JobService.createJob(req.userId!, req.body);
      res.status(201).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async getAllJob(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const { page = 1, size = 20, status, salaryRangeFrom, salaryRangeTo, jobType } = req.query;
      const response = await JobService.getAllJobs(req.userId!, page, size, status, salaryRangeFrom, salaryRangeTo, jobType);
      res.status(201).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async getJobById(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const response = await JobService.getJobById(req.params);
      res.status(201).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async publishJobById(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const response = await JobService.publishJob(req.params);
      res.status(201).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async updateJob(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const response = await JobService.updateJob(req.params, req.body);
      res.status(201).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  async deleteJob(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const response = await JobService.deleteJob(req.params);
      res.status(201).json(response);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
