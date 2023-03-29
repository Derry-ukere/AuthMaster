/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PresignedUrlDto } from '../models/PresignedUrlDto';
import type { PresignedUrlGeneratedDto } from '../models/PresignedUrlGeneratedDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class FilesModuleService {

    /**
     * Generate a file presigned url
     * Generate upload presigned url for file to be uploaded to amazon s3 bucket
     *
     * @param body Presigned URL request body
     * @returns PresignedUrlGeneratedDto Operation successful
     * @throws ApiError
     */
    public static generateFilePresignedUrl(
        body: PresignedUrlDto,
    ): CancelablePromise<PresignedUrlGeneratedDto> {
        return __request({
            method: 'POST',
            path: `/files/me/upload/generate-presigned-url`,
            body: body,
        });
    }

}