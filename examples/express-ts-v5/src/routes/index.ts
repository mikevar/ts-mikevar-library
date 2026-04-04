import { Router } from "express";
import { usersRouter } from "./users.route";

const router: Router = Router();

router.use("/users", usersRouter);

export { router };
