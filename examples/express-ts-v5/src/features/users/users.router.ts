import { Router, Request, Response } from "express";
import { getUsersForDataGrid } from "./users.service";
import type { UsersForTableQuery } from "./users.types";

const router: Router = Router();

router.get(
  "/for-data-grid",
  async (req: Request<{}, {}, {}, UsersForTableQuery>, res: Response) => {
    try {
      const result = await getUsersForDataGrid({ query: req.query });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export { router as usersRouter };
