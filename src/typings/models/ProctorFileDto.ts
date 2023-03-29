/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProctorFileDto = {
    type?: ProctorFileDto.type;
    fileKey?: string;
    readonly fileName?: string;
    url?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export namespace ProctorFileDto {

    export enum type {
        AUDIO = 'AUDIO',
        IMAGE = 'IMAGE',
    }


}
