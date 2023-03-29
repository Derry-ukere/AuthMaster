import { CandidateDto, CompanyDto, UserDto } from '@typings/index';
import { CandidatesEntity, CompaniesEntity, CompanyUserEntity } from './entities';

export const toUserDto = (user: CandidatesEntity | CompanyUserEntity): UserDto => {
  const { id, firstName, lastName, middleName, email, phoneNumber, photo } = user;

  return {
    id,
    firstName,
    lastName,
    middleName,
    email,
    phoneNumber,
    photo,
  };
};

export const fromUserDto = (user: UserDto): Partial<CandidatesEntity> => {
  const { firstName, middleName, lastName } = user;

  return {
    firstName,
    lastName,
    middleName,
  };
};

export const toCompanyDto = (company: CompaniesEntity): CompanyDto => {
  const { id, name, logo, bio, size, industry, locations, website, linkedIn, instagram, twitter, facebook, glassdoor } = company;

  return {
    id,
    name,
    logo,
    bio,
    size,
    industry,
    locations: (locations || '').split('||').filter(Boolean),
    socials: {
      website,
      linkedIn,
      instagram,
      twitter,
      facebook,
      glassdoor,
    },
  };
};

export const toCandidateDto = (candidate: CandidatesEntity): CandidateDto => {
  const { dob, salaryCurrency: currency, salaryCurrent, salaryDesired, jobPreferredLocation } = candidate;

  return {
    dob,
    salary: {
      current: {
        value: salaryCurrent,
        currency,
      },
      desired: {
        value: salaryDesired,
        currency,
      },
    },
    jobLocation: jobPreferredLocation,
  };
};
