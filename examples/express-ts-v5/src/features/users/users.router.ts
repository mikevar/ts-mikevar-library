import { Router, Request, Response } from "express";
import { getUsersForDataGrid } from "./users.service";
import type { UsersForDataGridQuery } from "./users.types";

const router: Router = Router();

router.get(
  "/for-selector",
  async (req: Request<{}, {}, {}, UsersForDataGridQuery>, res: Response) => {
    try {
      const result = await getUsersForDataGrid({ query: req.query });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get(
  "/for-data-grid",
  async (req: Request<{}, {}, {}, UsersForDataGridQuery>, res: Response) => {
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
