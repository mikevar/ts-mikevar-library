import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COL_DIRECTION_SEPARATOR,
  DefaultQueryValuesOptions,
  type FilterMode,
  mergeDefaultAndCustomQueryKeys,
  mergeDefaultQueryValues,
  type NormalizedQueryObject,
  parseAndNormalize,
  QueryKeysOptions,
} from "@mikevar/data-grid";

interface UseDataGridStatesOptions {
  url: string;
  filterQueryKeys?: string[];
  onUrlChange?: (url: string) => void;
  queryKeys?: QueryKeysOptions;
  defaultQueryValues: DefaultQueryValuesOptions;
}

export function useDataGridStates(options: UseDataGridStatesOptions) {
  const queryKeys = useMemo(() => {
    return mergeDefaultAndCustomQueryKeys(options.queryKeys);
  }, [options.queryKeys]);
  const defaultQueryValues = useMemo(() => {
    return mergeDefaultQueryValues(options.defaultQueryValues);
  }, [options.defaultQueryValues]);

  const searchParams = useMemo(() => {
    return new URLSearchParams(options.url);
  }, [options.url]);

  const gridKeys = useMemo(() => {
    return new Set([
      ...Object.values(queryKeys),
      ...(options.filterQueryKeys ?? []),
    ]);
  }, [options.filterQueryKeys]);

  const query = useMemo(() => {
    return Object.fromEntries(
      Array.from(searchParams.entries()).filter(([key]) => gridKeys.has(key)),
    );
  }, [searchParams, gridKeys]);

  const persistedState = useMemo<NormalizedQueryObject>(() => {
    const { normalized } = parseAndNormalize({
      query,
      queryKeys,
    });

    return normalized;
  }, [query]);

  const [draftState, setDraftState] =
    useState<NormalizedQueryObject>(persistedState);

  useEffect(() => {
    setDraftState(persistedState);
  }, [persistedState]);

  const setFilterMode = useCallback((filterMode: FilterMode) => {
    setDraftState((prev) => ({
      ...prev,

      filtering: {
        ...prev.filtering,
        mode: filterMode,
      },
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setDraftState((prev) => {
      if (prev.pagination.mode !== "offset") {
        return prev;
      }

      return {
        ...prev,

        pagination: {
          ...prev.pagination,
          page,
        },
      };
    });
  }, []);

  const nextPage = useCallback(() => {
    setDraftState((prev) => {
      if (prev.pagination.mode !== "offset") {
        return prev;
      }

      return {
        ...prev,

        pagination: {
          ...prev.pagination,
          page: prev.pagination.page + 1,
        },
      };
    });
  }, []);

  const previousPage = useCallback(() => {
    setDraftState((prev) => {
      if (prev.pagination.mode !== "offset") {
        return prev;
      }

      return {
        ...prev,

        pagination: {
          ...prev.pagination,
          page: Math.max(1, prev.pagination.page - 1),
        },
      };
    });
  }, []);

  const setSearch = useCallback((search: string) => {
    setDraftState((prev) => {
      if (prev.filtering.mode !== "search") {
        return prev;
      }

      return {
        ...prev,

        filtering: {
          ...prev.filtering,
          search,
        },

        pagination: {
          ...prev.pagination,
          page: 1,
        },
      };
    });
  }, []);

  const setFilter = useCallback((queryKey: string, value: string) => {
    setDraftState((prev) => {
      if (prev.filtering.mode !== "filter") {
        return prev;
      }

      const updatedRawFilters = {
        ...prev.filtering.rawFilters,
        [queryKey]: value,
      };

      return {
        ...prev,

        filtering: {
          ...prev.filtering,
          rawFilters: updatedRawFilters,
        },
      };
    });
  }, []);

  const submit = useCallback(() => {
    const nextParams = new URLSearchParams();

    for (const [key, value] of searchParams.entries()) {
      if (!gridKeys.has(key)) {
        nextParams.set(key, value);
      }
    }

    nextParams.set(queryKeys.filterMode, draftState.filtering.mode);

    if (draftState.filtering.mode === "search") {
      nextParams.set(queryKeys.search, draftState.filtering.search);
    }

    nextParams.set(queryKeys.paginationMode, draftState.pagination.mode);

    if (draftState.pagination.mode === "offset") {
      nextParams.set(queryKeys.page, String(draftState.pagination.page));
    } else if (draftState.pagination.mode === "cursor") {
      nextParams.set(queryKeys.cursor, draftState.pagination.cursor);
    }

    nextParams.set(queryKeys.limit, String(draftState.pagination.limit));

    nextParams.set(
      queryKeys.orders,
      draftState.sorting.orders
        .map(
          (order) =>
            `${order.column}${COL_DIRECTION_SEPARATOR}${order.direction}`,
        )
        .join(","),
    );

    for (const [key, value] of Object.entries(
      draftState.filtering.rawFilters,
    )) {
      nextParams.set(key, value);
    }

    options.onUrlChange?.(nextParams.toString());
  }, [draftState, options, searchParams]);

  const resetToPersisted = useCallback(() => {
    setDraftState(persistedState);
  }, [persistedState]);

  return {
    persistedState,
    draftState,

    actions: {
      setFilterMode,
      setPage,
      nextPage,
      previousPage,
      setSearch,
      setFilter,

      submit,
      resetToPersisted,
    },
  };
}
