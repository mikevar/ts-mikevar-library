import { Router, Request, Response } from "express";
import { type BaseRequestQueryObject } from "@mikevar/parse-data-grid-query";
import {
  createDataGrid,
  type Fields,
  DataGridQuery,
} from "@mikevar/drizzle-data-grid";
import { db } from "../db";
import * as schema from "../schema";

const router: Router = Router();

type UsersOrderByKey = "id" | "name" | "email";
type UsersForTableQuery = BaseRequestQueryObject<UsersOrderByKey> & {
  name__iLike?: string;
  email__iLike?: string;
  roleId__eq?: number;
};

router.get(
  "/for-table",
  async (req: Request<{}, {}, {}, UsersForTableQuery>, res: Response) => {
    const fields: Fields<UsersOrderByKey> = {
      id: {
        column: schema.users.id,
        type: "number",
      },
      name: {
        column: schema.users.name,
        type: "string",
      },
      email: {
        column: schema.users.email,
        type: "string",
      },
    };
    const dataGrid = createDataGrid<UsersForTableQuery, UsersOrderByKey, any>({
      query: {
        query: req.query,
        allowed: ["id", "name", "email"],
      },
      fields,
      queryBuilders: {
        items: (args: {
          filters: any;
          orderBy: any;
          pagination: {
            limit: number;
            offset: number;
          };
        }) => {
          return db
            .select()
            .from(schema.users)
            .where(args.filters)
            .orderBy(args.orderBy)
            .limit(args.pagination.limit)
            .offset(args.pagination.offset);
        },
        total: (args: { filters: any; count: any }) => {
          return db
            .select({ count: args.count() })
            .from(schema.users)
            .where(args.filters);
        },
      },
    });
    await dataGrid.execute();
    res.json(dataGrid.toJSON());
  },
);

export { router as usersRouter };
