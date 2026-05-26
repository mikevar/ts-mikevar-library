import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COL_DIRECTION_SEPARATOR,
  COL_OPERATOR_SEPARATOR,
  type FilterMode,
  FilterOperator,
  type NormalizedQueryObject,
  parseAndNormalize,
} from "@mikevar/data-grid";

interface UseDataGridStatesOptions {
  url: string;
  filterQueryKeys?: string[];
  onUrlChange?: (url: string) => void;
}

export function useDataGridStates(options: UseDataGridStatesOptions) {
  const searchParams = useMemo(() => {
    return new URLSearchParams(options.url);
  }, [options.url]);

  const gridKeys = useMemo(() => {
    return new Set([
      "filterMode",
      "search",
      "paginationMode",
      "page",
      "limit",
      "cursor",
      "orders",

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

      queryKeys: {
        filterMode: "filterMode",
        search: "search",
        paginationMode: "paginationMode",
        page: "page",
        limit: "limit",
        cursor: "cursor",
        orders: "orders",
      },
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

      const [column, operator] = queryKey.split(COL_OPERATOR_SEPARATOR) as [
        string,
        FilterOperator,
      ];

      if (!column || !operator) {
        return prev;
      }

      const existingFilterObject = prev.filtering.filters.find((filter) => {
        return filter.column === column && filter.operator === operator;
      });

      if (existingFilterObject?.value === value) {
        return prev;
      }

      const newFilters = [...prev.filtering.filters];

      return {
        ...prev,

        filtering: {
          ...prev.filtering,
          filters: {
            ...prev.filtering.filters,
            [queryKey]: value,
          },
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

    nextParams.set("filterMode", draftState.filtering.mode);

    if (draftState.filtering.mode === "search") {
      nextParams.set("search", draftState.filtering.search);
    }

    nextParams.set("paginationMode", draftState.pagination.mode);

    if (draftState.pagination.mode === "offset") {
      nextParams.set("page", String(draftState.pagination.page));
    } else if (draftState.pagination.mode === "cursor") {
      nextParams.set("cursor", draftState.pagination.cursor);
    }

    nextParams.set("limit", String(draftState.pagination.limit));

    nextParams.set(
      "orders",
      draftState.sorting.orders
        .map(
          (order) =>
            `${order.column}${COL_DIRECTION_SEPARATOR}${order.direction}`,
        )
        .join(","),
    );

    for (const filter of draftState.filtering.filters) {
      nextParams.set(
        `${filter.column}${COL_OPERATOR_SEPARATOR}${filter.operator}`,
        filter.value,
      );
    }

    options.onUrlChange?.(nextParams.toString());
  }, [draftState, options, searchParams]);

  const reset = useCallback(() => {
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

      submit,
      reset,
    },
  };
}
