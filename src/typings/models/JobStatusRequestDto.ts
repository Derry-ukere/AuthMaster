/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type JobStatusRequestDto = {
    status?: JobStatusRequestDto.status;
}

export namespace JobStatusRequestDto {

    export enum status {
        PUBLISH = 'PUBLISH',
        CLOSE = 'CLOSE',
    }


}
