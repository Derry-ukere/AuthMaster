/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PresignedUrlDto = {
    contentType: string;
    uploadType?: PresignedUrlDto.uploadType;
}

export namespace PresignedUrlDto {

    export enum uploadType {
        CV = 'CV',
        PHOTOS = 'PHOTOS',
        PROCTOR = 'PROCTOR',
    }


}
