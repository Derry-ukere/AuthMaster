/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CvFileDto } from '../models/CvFileDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class CvxModuleService {

    /**
     * Get user's CV
     * @returns CvFileDto Operation successful
     * @throws ApiError
     */
    public static getCvxModule(): CancelablePromise<CvFileDto> {
        return __request({
            method: 'GET',
            path: `/cvx/file`,
        });
    }

    /**
     * Add a user's CV
     * @param body Presigned URL request body
     * @returns CvFileDto Operation successful
     * @throws ApiError
     */
    public static addCvFile(
        body: CvFileDto,
    ): CancelablePromise<CvFileDto> {
        return __request({
            method: 'POST',
            path: `/cvx/file`,
            body: body,
        });
    }

}