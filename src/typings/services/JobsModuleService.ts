/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobDto } from '../models/JobDto';
import type { JobListDto } from '../models/JobListDto';
import type { JobStatusRequestDto } from '../models/JobStatusRequestDto';
import type { StatusDto } from '../models/StatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class JobsModuleService {

    /**
     * Create a job
     * @param body
     * @returns JobDto Request successful
     * @throws ApiError
     */
    public static createJob(
        body: JobDto,
    ): CancelablePromise<JobDto> {
        return __request({
            method: 'POST',
            path: `/jobs/create`,
            body: body,
        });
    }

    /**
     * Get list of jobs
     * @param status
     * @param text
     * @param salaryFrom
     * @param salaryTo
     * @param type
     * @returns JobListDto Request successful
     * @throws ApiError
     */
    public static getJobsList(
        status?: string,
        text?: string,
        salaryFrom?: string,
        salaryTo?: string,
        type?: string,
    ): CancelablePromise<JobListDto> {
        return __request({
            method: 'GET',
            path: `/jobs/all`,
            query: {
                'status': status,
                'text': text,
                'salaryFrom': salaryFrom,
                'salaryTo': salaryTo,
                'type': type,
            },
        });
    }

    /**
     * Publish a job
     * @param id Job Id
     * @param body
     * @returns JobDto Request successful
     * @throws ApiError
     */
    public static publishJob(
        id: string,
        body: JobStatusRequestDto,
    ): CancelablePromise<JobDto> {
        return __request({
            method: 'POST',
            path: `/jobs/all/${id}`,
            body: body,
        });
    }

    /**
     * Get job by ID
     * @param id Job Id
     * @returns JobDto Request successful
     * @throws ApiError
     */
    public static getJobById(
        id: string,
    ): CancelablePromise<JobDto> {
        return __request({
            method: 'GET',
            path: `/jobs/all/${id}`,
        });
    }

    /**
     * Update a job by ID
     * @param id Job Id
     * @param body
     * @returns JobDto Request successful
     * @throws ApiError
     */
    public static updateJob(
        id: string,
        body: JobDto,
    ): CancelablePromise<JobDto> {
        return __request({
            method: 'PATCH',
            path: `/jobs/all/${id}`,
            body: body,
        });
    }

    /**
     * Delete a job
     * @param id Job Id
     * @returns StatusDto Request successful
     * @throws ApiError
     */
    public static deleteJob(
        id: string,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'DELETE',
            path: `/jobs/all/${id}`,
        });
    }

}