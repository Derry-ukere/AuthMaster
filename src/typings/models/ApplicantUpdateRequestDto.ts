/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ApplicantUpdateRequestDto = {
    status?: ApplicantUpdateRequestDto.status;
}

export namespace ApplicantUpdateRequestDto {

    export enum status {
        ACCEPT = 'ACCEPT',
        REJECT = 'REJECT',
    }


}
