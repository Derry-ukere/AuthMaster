/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateDto } from '../models/CandidateDto';
import type { CompanyDto } from '../models/CompanyDto';
import type { PasswordChangeDto } from '../models/PasswordChangeDto';
import type { PasswordResetDto } from '../models/PasswordResetDto';
import type { SigninRequestDto } from '../models/SigninRequestDto';
import type { SignupRequestDto } from '../models/SignupRequestDto';
import type { StatusDto } from '../models/StatusDto';
import type { TeamInviteResponseDto } from '../models/TeamInviteResponseDto';
import type { TeamMemberDto } from '../models/TeamMemberDto';
import type { TeamMemberListDto } from '../models/TeamMemberListDto';
import type { TokenDto } from '../models/TokenDto';
import type { UserDto } from '../models/UserDto';
import type { UserPasswordChangeDto } from '../models/UserPasswordChangeDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class UserModuleService {

    /**
     * Register new user
     * @param body Signup credentials
     * @returns StatusDto Signup success
     * @throws ApiError
     */
    public static authSignup(
        body: SignupRequestDto,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/users/auth/signup`,
            body: body,
        });
    }

    /**
     * Authenticate user
     * @param body Signin credentials
     * @returns TokenDto Signin successful
     * @throws ApiError
     */
    public static authSignin(
        body: SigninRequestDto,
    ): CancelablePromise<TokenDto> {
        return __request({
            method: 'POST',
            path: `/users/auth/signin`,
            body: body,
        });
    }

    /**
     * Confirm signup email address
     * Auth token to be gotten from email sent to user to confirm their email address
     *
     * @returns StatusDto Operation successful
     * @throws ApiError
     */
    public static authSignupEmailConfirm(): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/users/auth/email/confirm`,
        });
    }

    /**
     * Reset user password
     * @param body Login credentials
     * @returns StatusDto Operation successful
     * @throws ApiError
     */
    public static authResetPassword(
        body: PasswordResetDto,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/users/auth/password/reset`,
            body: body,
        });
    }

    /**
     * Change user password
     * Auth token to be gotten from email sent to the user via the /reset endpoint
     *
     * @param body Login credentials
     * @returns StatusDto Operation successful
     * @throws ApiError
     */
    public static authChangePassword(
        body: PasswordChangeDto,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/users/auth/password/change`,
            body: body,
        });
    }

    /**
     * Get company information
     * @returns CompanyDto Request successful
     * @throws ApiError
     */
    public static getUserCompany(): CancelablePromise<CompanyDto> {
        return __request({
            method: 'GET',
            path: `/users/company`,
        });
    }

    /**
     * Update company info
     * @param body
     * @returns CompanyDto Request successful
     * @throws ApiError
     */
    public static updateCompanyInfo(
        body: CompanyDto,
    ): CancelablePromise<CompanyDto> {
        return __request({
            method: 'PATCH',
            path: `/users/company`,
            body: body,
        });
    }

    /**
     * Get authenticated user
     * @returns UserDto Request successful
     * @throws ApiError
     */
    public static getActiveUser(): CancelablePromise<UserDto> {
        return __request({
            method: 'GET',
            path: `/users/me`,
        });
    }

    /**
     * Update user info
     * @param body
     * @returns UserDto Request successful
     * @throws ApiError
     */
    public static updateUserInfo(
        body: UserDto,
    ): CancelablePromise<UserDto> {
        return __request({
            method: 'PATCH',
            path: `/users/me`,
            body: body,
        });
    }

    /**
     * Change user password
     * @param body
     * @returns StatusDto Request successful
     * @throws ApiError
     */
    public static userChangePassword(
        body: UserPasswordChangeDto,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/users/me/password`,
            body: body,
        });
    }

    /**
     * Add candidate information
     * @param body
     * @returns CandidateDto Request successful
     * @throws ApiError
     */
    public static addCandidateInfo(
        body: CandidateDto,
    ): CancelablePromise<CandidateDto> {
        return __request({
            method: 'POST',
            path: `/users/me/candidate`,
            body: body,
        });
    }

    /**
     * Get all team members
     * @returns TeamMemberListDto Request success
     * @throws ApiError
     */
    public static getTeamMembers(): CancelablePromise<TeamMemberListDto> {
        return __request({
            method: 'GET',
            path: `/users/teams`,
        });
    }

    /**
     * Adds a team member
     * @param body Request body
     * @returns TeamMemberDto Request successful
     * @throws ApiError
     */
    public static addTeamMember(
        body: TeamMemberDto,
    ): CancelablePromise<TeamMemberDto> {
        return __request({
            method: 'POST',
            path: `/users/teams`,
            body: body,
        });
    }

    /**
     * Remove a team member
     * @param id Member Id
     * @returns StatusDto Operation successful
     * @throws ApiError
     */
    public static removeTeamMember(
        id: string,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'DELETE',
            path: `/users/teams/${id}`,
        });
    }

    /**
     * Update team member
     * @param id Member Id
     * @param body Request body
     * @returns TeamMemberDto Update success
     * @throws ApiError
     */
    public static updateTeamMember(
        id: string,
        body: TeamMemberDto,
    ): CancelablePromise<TeamMemberDto> {
        return __request({
            method: 'PATCH',
            path: `/users/teams/${id}`,
            body: body,
        });
    }

    /**
     * Respond to team invite
     * @param body
     * @returns StatusDto Request successful
     * @throws ApiError
     */
    public static respondTeamInvite(
        body: TeamInviteResponseDto,
    ): CancelablePromise<StatusDto> {
        return __request({
            method: 'POST',
            path: `/users/teams/invite/respond`,
            body: body,
        });
    }

}