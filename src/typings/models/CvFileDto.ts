/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CvFileDto = {
    readonly id?: string;
    fileKey?: string;
    readonly fileName?: string;
    originalFileName?: string;
    url?: string;
    readonly content?: {
        html?: string;
        css?: string;
    };
}
