/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserTypes } from './UserTypes';

export type SigninRequestDto = {
    type: UserTypes;
    email: string;
    password: string;
}
