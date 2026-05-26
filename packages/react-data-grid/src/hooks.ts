import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COL_DIRECTION_SEPARATOR,
  type FilterMode,
  type NormalizedQueryObject,
  parseAndNormalize,
} from "@mikevar/data-grid";

interface UseDataGridStatesOptions {
  url: string;
  onUrlChange?: (url: string) => void;
}

export function useDataGridStates(options: UseDataGridStatesOptions) {
  const searchParams = useMemo(() => {
    return new URLSearchParams(options.url);
  }, [options.url]);

  const persistedState = useMemo<NormalizedQueryObject>(() => {
    const { normalized } = parseAndNormalize({
      query: Object.fromEntries(searchParams.entries()),

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
  }, [searchParams]);

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
    setDraftState((prev) => ({
      ...prev,

      pagination: {
        ...prev.pagination,
        page,
      },
    }));
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
    setDraftState((prev) => ({
      ...prev,

      filtering: {
        ...prev.filtering,
        search,
      },

      pagination: {
        ...prev.pagination,
        page: 1,
      },
    }));
  }, []);

  const submit = useCallback(() => {
    const nextParams = new URLSearchParams();

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

    options.onUrlChange?.(nextParams.toString());
  }, [draftState, options]);

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
