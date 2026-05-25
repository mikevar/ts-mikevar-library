import type { QueryKeysOptions, DefaultQueryValuesOptions } from "./types.ts";
import { parseQueryObject } from "./parse-query-object.ts";
import { normalizeParsedQueryObject } from "./normalize-parsed-query-object.ts";

interface ParseAndNormalizeQueryObjectOptions {
  query: Record<string, string>;
  queryKeys?: QueryKeysOptions | undefined;
  defaultQueryValues?: DefaultQueryValuesOptions | undefined;
}

export function parseAndNormalizeQueryObject(
  options: ParseAndNormalizeQueryObjectOptions,
) {
  const parsed = parseQueryObject({
    query: options.query,
    queryKeys: options.queryKeys,
  });
  const normalized = normalizeParsedQueryObject({
    parsedQuery: parsed,
    defaultQueryValues: options.defaultQueryValues,
  });
  return {
    parsed,
    normalized,
  };
}

export function parseAndNormalize(
  options: ParseAndNormalizeQueryObjectOptions,
) {
  return parseAndNormalizeQueryObject(options);
}
