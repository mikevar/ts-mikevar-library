import express, { type Express } from "express";
import { db } from "./db";
import * as schema from "./schema";
import { router } from "./routes";

const app: Express = express();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express + TS 🚀" });
});

app.get("/sanity", async (req, res) => {
  try {
    const result = await db.select().from(schema.users);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/", router);

export default app;
