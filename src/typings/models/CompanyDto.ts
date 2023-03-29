/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CompanyDto = {
    readonly id?: string;
    logo?: string;
    name?: string;
    bio?: string;
    size?: string;
    industry?: string;
    locations?: Array<string>;
    socials?: {
        website?: string;
        linkedIn?: string;
        instagram?: string;
        twitter?: string;
        facebook?: string;
        glassdoor?: string;
    };
    readonly createdAt?: string;
    readonly updatedAt?: string;
}
