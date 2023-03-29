import { v4 as uuidv4 } from 'uuid';
import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { Logger } from '@helpers/Logger';
import { JobDto, JobListDto, StatusDto, JobFindDto } from '@typings/index';
import { ParamsDictionary } from 'express-serve-static-core';
import { JobsEntity, BenefitsEntity } from './entities';
import * as DtoMap from './mapper';
import { paging } from '@handlers/Paging';

export const JobService = {
  async createJob(userId: string, data: JobDto): Promise<JobDto> {
    const { title, description, jobType, yearsOfExperience, skills, qualifications, preferredLocation, jobLocation, salary } = data;

    const jobId = uuidv4();
    const stringifiedSkills = skills?.toLocaleString();
    const stringifiedQualifications = qualifications?.toLocaleString();
    const stringifiedJobLocation = jobLocation?.toLocaleString();
    const stringifiedPreferredLocation = preferredLocation?.toLocaleString();

    const jobEntity = {
      id: jobId,
      userId,
      title,
      description,
      jobType,
      yearsOfExperience,
      skills: stringifiedSkills,
      qualifications: stringifiedQualifications,
      preferredLocation: stringifiedPreferredLocation,
      jobLocation: stringifiedJobLocation,
      currency: salary?.currency,
      salaryRangeFrom: salary?.rangeFrom,
      salaryRangeTo: salary?.rangeTo,
    };

    const benefits = {
      jobId: jobId,
      description: salary?.benefits,
    };

    try {
      const savedJob = await JobsEntity.addJob(jobEntity);
      await BenefitsEntity.addBenefits(benefits);
      const mappedToJobDto = DtoMap.toJobDto(savedJob);
      return mappedToJobDto;
    } catch (error) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to create Job');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'something went worng');
    }
  },

  async getAllJobs(
    userId: string,
    page: number,
    size: number,
    status: string,
    salaryRangeFrom: number,
    salaryRangeTo: number,
    jobType: string,
  ): Promise<JobListDto & { records: JobDto[] }> {
    const skip = (page - 1) * size;
    const take = size;

    const findQuery: JobFindDto = {
      userId,
      status: status,
      salaryRangeFrom,
      salaryRangeTo,
      jobType,
    };

    if (!status) {
      delete findQuery.status;
    }
    if (!jobType) {
      delete findQuery.jobType;
    }
    if (!salaryRangeTo) {
      delete findQuery.salaryRangeTo;
    }
    if (!salaryRangeFrom) {
      delete findQuery.salaryRangeFrom;
    }
    const [jobs, totalItems] = await JobsEntity.findJobsAndCount({
      where: findQuery,
      orderBy: {
        column: 'createdAt',
        order: 'DESC',
      },
      include: ['benefits'],
      skip,
      take,
    });

    return {
      name: 'jobs-list',
      ...paging(totalItems, jobs.length, page, size),
      records: jobs.map(DtoMap.toJobDto),
    };
  },

  async getJobById(data: ParamsDictionary): Promise<JobDto> {
    const { id } = data;
    try {
      const job = await JobsEntity.findJob({
        where: {
          id,
        },
      });
      const mappedToJobDto = DtoMap.toJobDto(job!);
      return mappedToJobDto;
    } catch (error) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to get Job');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'something went worng');
    }
  },

  async publishJob(data: ParamsDictionary): Promise<JobDto> {
    const { id } = data;
    try {
      const job = await JobsEntity.findJob({
        where: {
          id,
        },
      });

      if (job?.status === JobDto.status.DRAFTS) {
        await JobsEntity.updateJob(
          {
            status: JobDto.status.ACTIVE,
          },
          {
            where: {
              id,
            },
          },
        );

        // TODO
        // send job publish emaail to team memebers
      } else {
        throw new CustomError(ErrorCode.FORBIDDEN, 'Only Jobs drafts can be published');
      }

      const updatejob = await JobsEntity.findJob({
        where: {
          id,
        },
      });

      const mappedToJobDto = DtoMap.toJobDto(updatejob!);
      return mappedToJobDto;
    } catch (error) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to publishJob Job');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'unable to publish Job');
    }
  },

  async updateJob(data: ParamsDictionary, body: JobDto): Promise<JobDto> {
    const { id } = data;
    const { title, description, jobType, yearsOfExperience, skills, qualifications, preferredLocation, jobLocation, salary } = body;
    const stringifiedSkills = skills?.toLocaleString();
    const stringifiedQualifications = qualifications?.toLocaleString();
    const stringifiedJobLocation = jobLocation?.toLocaleString();
    const stringifiedPreferredLocation = preferredLocation?.toLocaleString();

    const updateJobEntity = {
      title,
      description,
      jobType,
      yearsOfExperience,
      skills: stringifiedSkills,
      qualifications: stringifiedQualifications,
      preferredLocation: stringifiedPreferredLocation,
      jobLocation: stringifiedJobLocation,
      currency: salary?.currency,
      salaryRangeFrom: salary?.rangeFrom,
      salaryRangeTo: salary?.rangeTo,
    };

    try {
      const job = await JobsEntity.findJob({
        where: {
          id,
        },
      });

      if (job?.status === JobDto.status.DRAFTS) {
        await JobsEntity.updateJob(
          {
            ...updateJobEntity,
          },
          {
            where: {
              id,
            },
          },
        );
      } else {
        throw new CustomError(ErrorCode.FORBIDDEN, 'Only Jobs drafts can be updated');
      }

      const updatedjob = await JobsEntity.findJob({
        where: {
          id,
        },
      });

      const mappedToJobDto = DtoMap.toJobDto(updatedjob!);
      return mappedToJobDto;
    } catch (error) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to update Job');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'unable to update Job');
    }
  },

  async deleteJob(data: ParamsDictionary): Promise<StatusDto> {
    const { id } = data;
    try {
      const job = await JobsEntity.findJob({
        where: {
          id,
        },
      });

      if (job?.status !== JobDto.status.DRAFTS) {
        throw new CustomError(ErrorCode.FORBIDDEN, 'Only Jobs drafts can be deleted');
      }
      await JobsEntity.delete(id);
      return {
        success: true,
        message: 'Sucessfully deleted Job',
      };
    } catch (error) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to delete Job');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'something went wrong,Unable to delete Job');
    }
  },
};
