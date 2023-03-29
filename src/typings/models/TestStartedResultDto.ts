/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TestStatusDto } from './TestStatusDto';

export type TestStartedResultDto = {
    resultId?: string;
    status?: TestStatusDto;
    expiresIn?: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}
