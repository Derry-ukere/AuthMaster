/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BindTestRequestDto = {
    id?: string;
    reference?: string;
    state?: BindTestRequestDto.state;
}

export namespace BindTestRequestDto {

    export enum state {
        BIND = 'BIND',
        UNBIND = 'UNBIND',
    }


}
