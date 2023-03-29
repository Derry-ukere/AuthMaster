import { TestDto, TestResultDto } from '@typings/index';
import { TestEntity } from './entities';
import { TestResultEntity } from '@modules/tests/entities';

export const toTestDto = (test?: TestEntity): TestDto => {

  if (!test) return {};
  const { id, title, description, instructions, durationType, durationValue } = test;
  return {
    id,
    title,
    description,
    instructions,
    duration: {
      type: durationType,
      value: durationValue
    },
  };
};

export const toTestResultDto = (testResults?: TestResultEntity[], jobId?: string, testId?: string): TestResultDto => {
  if (!testResults) return {};
  return {
    id: testId,
    testResults: testResults.map(r => ({
      id: r.id,
      testId: r.testId,
      jobId,
      applicationId: r.applicationId,
      result: {
        passed: r.passed,
        total: r.total,
      },
      status: r.status,
      completedAt: r.completedAt.toDateString(),
      createdAt: r.createdAt.toDateString(),
      updatedAt: r.updatedAt.toDateString(),
      score: r.score,
      proctor: {
        file: {
          type: r.proctor?.type,
          fileKey: r.proctor?.fileKey,
          url: r.proctor?.url,
          createdAt: r.proctor?.createdAt?.toDateString(),
          updatedAt: r.proctor?.updatedAt?.toDateString(),
        }
      }
    })),
  };
};
