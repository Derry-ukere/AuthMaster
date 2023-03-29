/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JobDto } from './JobDto';
import type { Metadata } from './Metadata';

export type ApplicationDto = {
    readonly id?: string;
    readonly status?: ApplicationDto.status;
    jobId: string;
    job?: JobDto;
    metadata?: Metadata;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export namespace ApplicationDto {

    export enum status {
        PENDING = 'PENDING',
        ACCEPTED = 'ACCEPTED',
        REJECTED = 'REJECTED',
    }


}
