/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TeamInviteResponseDto = {
    response?: TeamInviteResponseDto.response;
    password?: string;
}

export namespace TeamInviteResponseDto {

    export enum response {
        ACCEPT = 'ACCEPT',
        REJECT = 'REJECT',
    }


}
