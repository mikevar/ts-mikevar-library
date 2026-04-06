/**
 * Converts a value to a number, returning null if conversion fails
 * @param value - The value to convert
 * @returns The converted number or null if conversion fails
 */
export function toNumber(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  return Number.isFinite(n) ? n : null;
}

/**
 * Calculates the offset for pagination based on page and limit
 * @param page - The page number (1-indexed)
 * @param limit - The number of items per page
 * @returns The calculated offset
 */
export function calculateOffset({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): number {
  return (page - 1) * limit;
}
