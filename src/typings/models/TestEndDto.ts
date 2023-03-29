import { TestStatusDto } from './TestStatusDto';
export type TestEndDto = {
  id?: string,
  testResult: {
    id?: string;
    testId?: string;
    jobId?: string;
    applicationId?: string;
    result?: {
      passed: number;
      total: number;
    },
    status?: TestStatusDto,
    readonly createdAt?: string;
    readonly updatedAt?: string;
    readonly completedAt?: string;
  }
}
