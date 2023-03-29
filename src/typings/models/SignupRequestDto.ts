/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserTypes } from './UserTypes';

export type SignupRequestDto = {
    type: UserTypes;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    password: string;
}
