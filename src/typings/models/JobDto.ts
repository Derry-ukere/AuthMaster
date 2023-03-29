/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JobDto = {
    readonly id?: string;
    readonly status?: JobDto.status;
    title?: string;
    userId?: string;
    description?: string;
    jobType?: JobDto.jobType;
    yearsOfExperience?: string;
    skills?: Array<string>;
    qualifications?: Array<'BSC' | 'PHD'>;
    preferredLocation?: Array<string>;
    jobLocation?: Array<'OFFICE' | 'REMOTE' | 'HYBRID'>;
    salary?: {
        currency?: string;
        rangeFrom?: number;
        rangeTo?: number;
        benefits?: JobDto.benefits;
    };
    readonly publishedAt?: string;
    readonly closedAt?: string;
    readonly deadlineAt?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export namespace JobDto {

    export enum status {
        ACTIVE = 'ACTIVE',
        PAUSED = 'PAUSED',
        DRAFTS = 'DRAFTS',
        CLOSED = 'CLOSED',
    }

    export enum jobType {
        FULL_TIME = 'FULL_TIME',
        PART_TIME = 'PART_TIME',
        CONTRACT = 'CONTRACT',
    }

    export enum benefits {
        EQUITY = 'EQUITY',
        STOCK_OPTIONS = 'STOCK_OPTIONS',
    }


}
