/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TestDto = {
    id?: string;
    title?: string;
    userId?: string;
    description?: string;
    instructions?: string;
    duration?: {
        value?: number;
        type?: TestDto.type;
    };
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export namespace TestDto {

    export enum type {
        MINUTES = 'MINUTES',
        HOURS = 'HOURS',
    }


}
