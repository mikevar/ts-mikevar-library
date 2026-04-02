export type SortingOrder = "asc" | "desc";

export function parseSorting({ query }: { query: unknown }): SortingOrder {
  const order = (query as { order?: SortingOrder })?.order ?? "asc";
  return order;
}
