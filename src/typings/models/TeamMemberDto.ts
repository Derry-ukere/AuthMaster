/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TeamMemberDto = {
    readonly id?: string;
    readonly status?: TeamMemberDto.status;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    permissions?: Array<string>;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export namespace TeamMemberDto {

    export enum status {
        PENDING = 'PENDING',
        ACCEPTED = 'ACCEPTED',
        REJECTED = 'REJECTED',
        EXPIRED = 'EXPIRED',
    }


}
