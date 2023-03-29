import { v4 as uuidv4 } from 'uuid';
import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { TestResultListDto, TestResultDto, TestStartedResultDto, TestStatusDto, TestEndDto } from '@typings/index';
import { TestEntity } from './entities/Tests';
import { Logger } from '@helpers/Logger';
import * as DtoMap from './mapper';
import { TestResultEntity } from './entities/TestResults';
import { paging } from '@handlers/Paging';

export const TestResultsService = {
  async getTestResult(id: string, page: number, size: number): Promise<TestResultListDto & { records: TestResultDto }> {
    const skip = (page - 1) * size;
    const take = size;
    const findQuery = { testId: id };
    try {
      const [result, totalItems] = await TestResultEntity.findResult({
        where: findQuery,
        include: ['proctors'],
        skip,
        take
      });
      const test = await TestEntity.findTest({ where: { id } });
      return {
        name: 'test-results-list',
        ...paging(totalItems, result.length, page, size),
        records: DtoMap.toTestResultDto(result, test?.jobId, id)
      };
    } catch (err) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to get a Test', err);
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'something went wrong');
    }
  },
  async createResult(testId: string, expiresIn: number): Promise<TestStartedResultDto> {
    const testResultEntity = {
      id: uuidv4(),
      testId,
      expiresIn,
      status: TestStatusDto.IN_PROGRESS
    };

    try {
      const savedResult = await TestResultEntity.addResult(testResultEntity);
      return {
        resultId: savedResult.id,
        status: TestStatusDto.IN_PROGRESS,
        expiresIn,
        createdAt: savedResult.createdAt.toDateString(),
        updatedAt: savedResult.updatedAt.toDateString()
      };
    } catch (error) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to create TestResut');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'something went worng');
    }
  },
  async updateResult(data: { id: string, testId?: string, status?: TestStatusDto }): Promise<TestEndDto> {

    const result = await TestResultEntity.findTestResult({
      where: {
        id: data.id
      }
    });
    let test: TestEntity | undefined;
    if (data.testId) {
      if (result?.testId !== data.testId) {
        Logger.Error(ErrorCode.BAD_REQUEST, 'Unable to update TestResut');
        throw new CustomError(ErrorCode.BAD_REQUEST, 'something went worng');
      }
      test = await TestEntity.findTest({ where: { id: data.testId } });
    }
    const updated = {
      status: data.status,
    };
    try {
      await TestResultEntity.updateResult(
        updated,
        {
          where: { id: data.id }
        }
      );
      return {
        id: data.testId,
        testResult: {
          id: data.id,
          testId: data.testId,
          jobId: test?.jobId,
          applicationId: result?.applicationId,
          result: {
            passed: result?.passed ?? 0,
            total: result?.total ?? 0
          },
          status: TestStatusDto.COMPLETED,
          completedAt: new Date().toDateString(),
          createdAt: result?.createdAt.toDateString(),
          updatedAt: result?.updatedAt.toDateString()
        }
      };
    } catch (err) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to create TestResut');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'something went worng');
    }
  }
};
