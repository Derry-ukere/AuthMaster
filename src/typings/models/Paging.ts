/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Paging = {
    /**
     * Descriptive name for the list
     */
    name: string;
    /**
     * Number of items returned
     */
    size?: number;
    /**
     * Total number of items available
     */
    totalItems?: number;
    /**
     * Next page number
     */
    nextPage?: number;
    /**
     * Previous page number
     */
    previousPage?: number;
}
