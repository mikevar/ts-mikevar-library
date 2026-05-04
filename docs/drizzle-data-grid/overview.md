---
id: overview
title: Overview
---

This package provides a data grid implementation for Drizzle ORM, with support for pagination, sorting, and filtering.

## Motivation

I was appaled to learn that there is no good data grid implementation for Drizzle ORM, so I created this package to fill that gap.

Most manual implementations are good enough, but they are not easy to initialize and configure.

I need something that are:

- Easy to initialize and configure
- Easy to extend and customize
- Easy to maintain and update
- Easy to test and debug
- Full of magic!

## So I came up with this...

Imagine if you only need to do this:

```typescript
import { eq, count } from "drizzle-orm";
import { dgRun } from "@mikevar/drizzle-data-grid";
import { db } from "./db";
import * as schema from "./schema";

async function getUsersForDataGrid({
  query,
}: {
  query: Record<string, string>;
}) {
  const result = await dgRun({
    query: query,
    fieldsSchema: {
      id: {
        column: schema.users.id,
        type: "number",
      },
      name: {
        column: schema.users.name,
        type: "string",
        sortable: true,
        searchable: true,
        filterable: true,
      },
      email: {
        column: schema.users.email,
        type: "string",
        sortable: true,
        searchable: true,
        filterable: true,
      },
      roleId: {
        column: schema.users.roleId,
        type: "number",
        sortable: true,
        filterable: true,
      },
      roleName: {
        column: schema.roles.name,
        type: "string",
        searchable: true,
        filterable: true,
      },
    },
    queryBuilders: {
      items: db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          roleId: schema.users.roleId,
          role: {
            id: schema.roles.id,
            name: schema.roles.name,
          },
        })
        .from(schema.users)
        .leftJoin(schema.roles, eq(schema.users.roleId, schema.roles.id)),
      count: db
        .select({ count: count() })
        .from(schema.users)
        .leftJoin(schema.roles, eq(schema.users.roleId, schema.roles.id)),
    },
  });

  return result;
}
```

and when you register this function anywhere, doesn't matter, be it express route, hono route, or anything else, you can use it like this:

```typescript
// express route
app.get("/users", async (req, res) => {
  const result = await getUsersForDataGrid({
    query: req.query,
  });
  res.json(result);
});
```

then you call it like this:

```
http://localhost:3000/users/for-data-grid?page=1&limit=5&paginationMode=offset&filterMode=filter&name__iLike=john&orders=email:asc
```

and it will return something like this:

```json
{
  "data": [
    {
      "id": 499,
      "name": "Johnathan Quigley",
      "email": "Cletus_Miller@yahoo.com",
      "roleId": 20,
      "role": {
        "id": 20,
        "name": "ocelot"
      }
    },
    {
      "id": 117,
      "name": "Helga Johns",
      "email": "Helen34@hotmail.com",
      "roleId": 10,
      "role": {
        "id": 10,
        "name": "teriyaki"
      }
    },
    {
      "id": 15,
      "name": "Johnathan Wunsch",
      "email": "Lelah_Rosenbaum93@yahoo.com",
      "roleId": 17,
      "role": {
        "id": 17,
        "name": "scholarship"
      }
    },
    {
      "id": 120,
      "name": "Cristobal Johnston",
      "email": "Louisa_Parker23@hotmail.com",
      "roleId": 10,
      "role": {
        "id": 10,
        "name": "teriyaki"
      }
    },
    {
      "id": 161,
      "name": "Cydney Johns",
      "email": "Trudie_Runte87@hotmail.com",
      "roleId": 12,
      "role": {
        "id": 12,
        "name": "tool"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 6,
    "totalPages": 2,
    "hasNext": true,
    "hasPrevious": false,
    "nextPage": 2,
    "previousPage": null
  }
}
```

And this is just the tip of the iceberg, because you can do a lot more with this function, like:

```
http://localhost:3000/users/for-data-grid?page=1&limit=5&paginationMode=offset&filterMode=filter&roleName__iLike=something&orders=email:asc,roleId:desc
```

or:

```
http://localhost:3000/users/for-data-grid?cursor=1&limit=5&paginationMode=cursor&filterMode=filter&roleName__iLike=something&orders=id:asc
```
