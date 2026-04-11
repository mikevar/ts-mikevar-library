/**
 * Pagination mode for data grid queries
 */
export type PaginationMode = "offset" | "cursor";

/**
 * Base pagination configuration
 */
export interface BasePagination {
  mode: PaginationMode;
  limit: number;
}

/**
 * Offset-based pagination configuration
 */
export interface OffsetPagination extends BasePagination {
  page: number;
  offset: number;
}

/**
 * Cursor-based pagination configuration
 */
export interface CursorPagination extends BasePagination {
  cursor: string;
}

/**
 * Pagination configuration for data grid queries
 */
export type Pagination = OffsetPagination | CursorPagination;

/**
 * Base pagination options
 */
export interface BaseParsePaginationOptions {
  defaultPaginationMode?: PaginationMode;
  defaultLimit?: number;
  maxLimit?: number;
  strict?: boolean;
  queryKey?: {
    paginationMode?: string;
    page?: string;
    limit?: string;
    cursor?: string;
  };
}

/**
 * Offset-based pagination options
 */
export interface OffsetParsePaginationOptions extends BaseParsePaginationOptions {
  defaultPage?: number;
}

/**
 * Cursor-based pagination options
 */
export interface CursorParsePaginationOptions extends BaseParsePaginationOptions {
  defaultCursor?: string;
}

/**
 * Options for parsing pagination configuration
 */
export type ParsePaginationOptions =
  | OffsetParsePaginationOptions
  | CursorParsePaginationOptions;
