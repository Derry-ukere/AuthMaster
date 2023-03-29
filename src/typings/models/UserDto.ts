/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserTypes } from './UserTypes';

export type UserDto = {
    readonly id?: string;
    type?: UserTypes;
    firstName: string;
    middleName: string;
    lastName: string;
    readonly email?: string;
    phoneNumber?: string;
    photo?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}
