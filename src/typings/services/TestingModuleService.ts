/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BindTestRequestDto } from '../models/BindTestRequestDto';
import type { EndTestRequestDto } from '../models/EndTestRequestDto';
import type { ProctorEvidenceReqDto } from '../models/ProctorEvidenceReqDto';
import type { ScheduledTestDetailsDto } from '../models/ScheduledTestDetailsDto';
import type { StatusDto } from '../models/StatusDto';
import type { TestListDto } from '../models/TestListDto';
import type { TestResultDto } from '../models/TestResultDto';
import type { TestResultListDto } from '../models/TestResultListDto';
import type { TestResultUpdateDto } from '../models/TestResultUpdateDto';
import type { TestStartedResultDto } from '../models/TestStartedResultDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class TestingModuleService {

    /**
     * Get available tests
     * @param text
     * @returns TestListDto Request successful
     * @throws ApiError
     */
    public static getTestsList(
        text?: string,
    ): CancelablePromise<TestListDto> {
        return __request({
            method: 'GET',
            path: `/testing/tests`,
            query: {
                'text': text,
            },
        });
    }

    /**
     * Get test results
     * @param id Test Id
     * @returns TestResultListDto Request successful
     * @throws ApiError
     */
    public static getTestResults(
        id: string,
    ): CancelablePromise<TestResultListDto> {
        return __request({
            method: 'GET',
            path: `/testing/tests/${id}/results`,
        });
    }

    /**
     * Get attached tests
     * @param resource
     * @returns TestListDto Request successful
     * @throws ApiError
     */
    public static getAttachedTests(
        resource: string,
    ): CancelablePromise<TestListDto> {
        return __request({
            method: 'GET',
            path: `/testing/tests/attach`,
            query: {
                'resource': resource,
            },
        });
    }

    /**
     * Bind/Unbind a test to a resource
     * @param body
     * @returns StatusDto Request successful
     * @throws ApiError
     */
    public static bindUnbindTestToResource(
        body: BindTestRequestDto,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/testing/tests/attach`,
            body: body,
        });
    }

    /**
     * Get user's tests
     * @returns ScheduledTestDetailsDto Request successful
     * @throws ApiError
     */
    public static getUserTests(): CancelablePromise<ScheduledTestDetailsDto> {
        return __request({
            method: 'GET',
            path: `/testing/tests/scheduled/details`,
        });
    }

    /**
     * Start a test
     * @param id Test Id
     * @returns TestStartedResultDto Request successful
     * @throws ApiError
     */
    public static startTest(
        id: string,
    ): CancelablePromise<TestStartedResultDto> {
        return __request({
            method: 'POST',
            path: `/testing/tests/${id}/start`,
        });
    }

    /**
     * Ends a test
     * @param id Test Id
     * @param body
     * @returns TestResultDto Request successful
     * @throws ApiError
     */
    public static endTest(
        id: string,
        body: EndTestRequestDto,
    ): CancelablePromise<TestResultDto> {
        return __request({
            method: 'POST',
            path: `/testing/tests/${id}/end`,
            body: body,
        });
    }

    /**
     * Update test progress
     * @param id Result Id
     * @param body
     * @returns StatusDto Request successful
     * @throws ApiError
     */
    public static updateTestProgress(
        id: string,
        body: TestResultUpdateDto,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/testing/tests/results/${id}/progress`,
            body: body,
        });
    }

    /**
     * Adds proctor evidence
     * @param body
     * @returns StatusDto Request successful
     * @throws ApiError
     */
    public static addProctorEvidence(
        body: ProctorEvidenceReqDto,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/testing/proctor`,
            body: body,
        });
    }

}