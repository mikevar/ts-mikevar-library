import { Router } from "express";
import { usersRouter } from "../features/users/users.router";

const router: Router = Router();

router.use("/users", usersRouter);

export { router };
