import express from "express";

const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express + TS 🚀" });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
