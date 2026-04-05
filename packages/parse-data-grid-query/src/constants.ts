import { PaginationMode } from "./types.ts";

/**
 * Default cursor for cursor-based pagination
 */
export const DEFAULT_CURSOR = "";

/**
 * Default page number for pagination
 */
export const DEFAULT_PAGE = 1;
/**
 * Default limit for pagination
 */
export const DEFAULT_LIMIT = 10;
/**
 * Maximum limit for pagination
 */
export const MAX_LIMIT = 100;

/**
 * Default pagination mode
 */
export const DEFAULT_PAGINATION_MODE: PaginationMode = "offset";

/**
 * Query key for pagination mode
 */
export const PAGINATION_MODE_QUERY_KEY = "paginationMode";

/**
 * Query key for page parameter
 */
export const PAGE_QUERY_KEY = "page";

/**
 * Query key for cursor parameter
 */
export const CURSOR_QUERY_KEY = "cursor";

/**
 * Query key for limit parameter
 */
export const LIMIT_QUERY_KEY = "limit";
/**
 * Query key for order parameter
 */
export const ORDER_QUERY_KEY = "order";
/**
 * Query key for order by parameter
 */
export const ORDER_BY_QUERY_KEY = "orderBy";
/**
 * Query key for filter mode parameter
 */
export const FILTER_MODE_QUERY_KEY = "filterMode";
/**
 * Query key for search parameter
 */
export const SEARCH_QUERY_KEY = "search";

/**
 * Array of all reserved query keys
 */
export const RESERVED_QUERY_KEYS = [
  PAGINATION_MODE_QUERY_KEY,
  PAGE_QUERY_KEY,
  CURSOR_QUERY_KEY,
  LIMIT_QUERY_KEY,
  ORDER_QUERY_KEY,
  ORDER_BY_QUERY_KEY,
  FILTER_MODE_QUERY_KEY,
  SEARCH_QUERY_KEY,
] as const;
