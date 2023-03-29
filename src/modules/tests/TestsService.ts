import { v4 as uuid4 } from 'uuid';
import { ErrorCode } from '@constants/ErrorCodes';
import { CustomError } from '@helpers/CustomError';
import { TestDto, TestListDto, FindTestDto, BindTestRequestDto, StatusDto } from '@typings/index';
import { TestEntity } from './entities/Tests';
import { Logger } from '@helpers/Logger';
import { paging } from '@handlers/Paging';
import * as DtoMap from './mapper';

export const TestsService = {
  async createTest(userId: string, data: TestDto): Promise<TestDto> {
    const { title, description, instructions, duration } = data;
    const testId = uuid4();

    const testEntity = {
      id: testId,
      userId,
      title,
      description,
      instructions,
      durationType: duration?.type,
      durationValue: duration?.value
    };
    try {
      const savedTest = await TestEntity.addTest(testEntity);
      const mappedToTestDto = DtoMap.toTestDto(savedTest);
      return mappedToTestDto;
    } catch (error) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to create test');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'something went wrong');
    }
  },
  async getAllTests(data: FindTestDto): Promise<TestListDto & { records: TestDto[] }> {
    const skip = (data.page - 1) * data.size;
    const take = data.size;

    let tests, totalItems;
    if (data.text) {
      const res = await TestEntity.findByText({
        where: {},
        orderBy: {
          column: 'createdAt',
          order: 'DESC'
        },
        skip,
        take
      }, data.text);
      tests = res[0];
      totalItems = res[1];
    } else {
      const res = await TestEntity.findTestsandCount({
        where: {},
        orderBy: {
          column: 'createdAt',
          order: 'DESC'
        },
        skip,
        take
      });
      tests = res[0];
      totalItems = res[1];
    }

    return {
      name: 'tests-list',
      ...paging(totalItems, tests.length, data.page, data.size),
      records: tests.map(DtoMap.toTestDto)
    };
  },
  async updateTest(data: BindTestRequestDto): Promise<StatusDto> {
    try {
      const { id, reference, state } = data;
      await TestEntity.updateTest(
        {
          jobId: state === BindTestRequestDto.state.BIND ? reference : undefined
        },
        {
          where: {
            id
          }
        }
      );
      return {
        success: true,
        message: 'success'
      };
    } catch (error) {
      Logger.Error(ErrorCode.INTERNAL_ERROR, 'Unable to create test');
      throw new CustomError(ErrorCode.INTERNAL_ERROR, 'something went wrong');
    }
  },
  async getScheduledTests(userId: string, page: number, size: number): Promise<{ tests: TestDto[] }> {
    const skip = (page - 1) * size;
    const take = size;
    const [tests] = await TestEntity.findTestsandCount({
      where: { userId },
      orderBy: {
        column: 'createdAt',
        order: 'DESC'
      },
      skip,
      take
    });
    return {
      tests: tests.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        instructions: t.instructions,
        duration: {
          value: t.durationValue,
          type: t.durationType
        },
        createdAt: t.createdAt.toDateString(),
        updatedAt: t.updatedAt.toDateString()
      }))
    };
  }
};
