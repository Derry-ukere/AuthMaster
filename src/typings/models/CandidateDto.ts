/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AmountFormat } from './AmountFormat';

export type CandidateDto = {
    salary?: {
        current?: AmountFormat;
        desired?: AmountFormat;
    };
    jobLocation?: CandidateDto.jobLocation;
    dob?: string;
}

export namespace CandidateDto {

    export enum jobLocation {
        OFFICE = 'OFFICE',
        REMOTE = 'REMOTE',
        HYBRID = 'HYBRID',
    }


}
