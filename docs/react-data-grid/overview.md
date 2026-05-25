---
id: overview
title: Overview
---

## Motivation

After I created `@mikevar/drizzle-data-grid`, I realized that it would be useful to have a React headless functionalities for data grid, with support for pagination, sorting, and filtering.

So I created `@mikevar/react-data-grid` to fill that gap.

The idea behind this package is to combine some of the most powerful but lightweight packages for React, such as:

- `@tanstack/react-query` for state management
- `@tanstack/react-router` for routing
- `nuqs` for query parameters

to work together to manage states and derived states of the data grid.

## Current Pain

As of now, if we want to manage data grid state in a type-safe and reactive way, we would typically use something like this:

```typescript
// manage filters
import { useQueryState } from "nuqs";

const [filterMode, setFilterMode] = useQueryState("fm", {
  defaultValue: "filter",
});
const [paginationMode, setPaginationMode] = useQueryState("pm", {
  defaultValue: "offset",
});
const [page, setPage] = useQueryState("p", {
  defaultValue: 1,
  type: "number",
  clearOnDefault: true,
});
const [limit, setLimit] = useQueryState("l", {
  defaultValue: 5,
  type: "number",
  clearOnDefault: true,
});
const [orders, setOrders] = useQueryState("o", {
  type: (value) => value.split(","),
  parse: (value) => value.join(","),
  clearOnDefault: true,
});
const [filters, setFilters] = useQueryState("f", {
  type: (value) => value.split(","),
  parse: (value) => value.join(","),
  clearOnDefault: true,
});
const [search, setSearch] = useQueryState("s", {
  clearOnDefault: true,
});
const [cursor, setCursor] = useQueryState("c", {
  type: "number",
  clearOnDefault: true,
});

//
```

And also another painful part is if you need to serialize and deserialize them and connect them to the URL query. For example:

```typescript
const syncFilterState = () => {
  const queryParams = new URLSearchParams(searchParams);

  if (filterMode !== "off") {
    queryParams.set("fm", filterMode);
  } else {
    queryParams.delete("fm");
  }
  if (paginationMode !== "off") {
    queryParams.set("pm", paginationMode);
  } else {
    queryParams.delete("pm");
  }
  if (page !== 1) {
    queryParams.set("p", page.toString());
  } else {
    queryParams.delete("p");
  }
  if (limit !== 5) {
    queryParams.set("l", limit.toString());
  } else {
    queryParams.delete("l");
  }
  if (orders && orders.length > 0) {
    queryParams.set("o", orders.join(","));
  } else {
    queryParams.delete("o");
  }
  if (filters && filters.length > 0) {
    queryParams.set("f", filters.join(","));
  } else {
    queryParams.delete("f");
  }
  if (search) {
    queryParams.set("s", search);
  } else {
    queryParams.delete("s");
  }
  if (cursor !== undefined && cursor !== null) {
    queryParams.set("c", cursor.toString());
  } else {
    queryParams.delete("c");
  }

  router.push("?" + queryParams.toString());
};
```

This is something small, trivial, but yet it's painful enough to trigger more cost in AI tokens and it's easy to make mistake.

To avoid this, I created this package!
