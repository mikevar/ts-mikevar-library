import { Router } from "express";
import { getUsersForDataGrid, getUsersForSelector } from "./users.service";

const router: Router = Router();

router.get("/for-selector", async (req, res) => {
  try {
    const result = await getUsersForSelector({
      query: req.query as Record<string, string>,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/for-data-grid", async (req, res) => {
  try {
    const result = await getUsersForDataGrid({
      query: req.query as Record<string, string>,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as usersRouter };
