/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProctorFileDto } from './ProctorFileDto';
import type { TestStatusDto } from './TestStatusDto';

export type TestResultDto = {
    id?: string;
    testResults?: Array<{
        id?: string;
        testId?: string;
        jobId?: string;
        applicationId?: string;
        result?: {
            passed?: number;
            total?: number;
        };
        status?: TestStatusDto;
        score?: number;
        proctor?: {
            file?: ProctorFileDto;
        };
        readonly completedAt?: string;
        readonly createdAt?: string;
        readonly updatedAt?: string;
    }>;
}
