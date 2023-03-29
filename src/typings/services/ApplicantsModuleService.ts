/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicantListDto } from '../models/ApplicantListDto';
import type { ApplicantUpdateRequestDto } from '../models/ApplicantUpdateRequestDto';
import type { ApplicationDto } from '../models/ApplicationDto';
import type { StatusDto } from '../models/StatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class ApplicantsModuleService {

    /**
     * Submit an application
     * @param body
     * @returns ApplicationDto Request successful
     * @throws ApiError
     */
    public static submitApplication(
        body: ApplicationDto,
    ): CancelablePromise<ApplicationDto> {
        return __request({
            method: 'POST',
            path: `/applicants/apply`,
            body: body,
        });
    }

    /**
     * Get list of applications
     * @param status
     * @returns ApplicantListDto Request successful
     * @throws ApiError
     */
    public static getApplications(
        status?: string,
    ): CancelablePromise<ApplicantListDto> {
        return __request({
            method: 'GET',
            path: `/applicants/all`,
            query: {
                'status': status,
            },
        });
    }

    /**
     * Update an applicant's application
     * @param id Application Id
     * @param body
     * @returns StatusDto Request successful
     * @throws ApiError
     */
    public static updateApplicant(
        id: string,
        body: ApplicantUpdateRequestDto,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/applicants/all/${id}`,
            body: body,
        });
    }

}