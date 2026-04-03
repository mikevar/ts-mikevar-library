import express, { type Express } from "express";

const app: Express = express();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express + TS 🚀" });
});

export default app;
