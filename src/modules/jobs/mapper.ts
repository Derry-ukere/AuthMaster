import { JobDto } from '@typings/index';
import { JobsEntity } from './entities';

export const toJobDto = (job: JobsEntity): JobDto => {
  const { 
    id,
    closedAt,
    createdAt,
    currency,
    description,
    deadlineAt,
    jobLocation,
    jobType,
    preferredLocation,
    publishedAt,
    qualifications,
    salaryRangeFrom,
    salaryRangeTo,
    skills,
    status,
    title,
    updatedAt,
    yearsOfExperience,
    userId,
  } = job;

  return {
    id,
    userId,
    status,
    title,
    description,
    jobType,
    yearsOfExperience,
    jobLocation : (jobLocation || '').split('||').filter(Boolean) as any,
    preferredLocation: (preferredLocation || '').split('||').filter(Boolean),
    qualifications: (qualifications || '').split('||').filter(Boolean) as any,
    skills : (skills || '').split('||').filter(Boolean),
    salary: {
      currency: currency ,
      rangeFrom: salaryRangeFrom,
      rangeTo: salaryRangeTo,
    },
    closedAt,
    createdAt,
    deadlineAt,
    updatedAt,
    publishedAt,
  };
};
