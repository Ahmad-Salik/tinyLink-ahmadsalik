// server.js

import 'dotenv/config';

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import linksRouter from "./src/routes/links.js";
import healthRouter from "./src/routes/health.js";
import { pool } from "./src/db.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Fix __dirname for ES Modules (important for Vercel)
|--------------------------------------------------------------------------
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, "public")));

/*
|--------------------------------------------------------------------------
| View Engine (EJS)
|--------------------------------------------------------------------------
*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/*
|--------------------------------------------------------------------------
| Dashboard (Home Page)
|--------------------------------------------------------------------------
*/
app.get("/", async (req, res) => {
  res.render("dashboard");
});

/*
|--------------------------------------------------------------------------
| Stats Page (Full HTML page with stats)
| URL: /stats/:code
|--------------------------------------------------------------------------
*/
app.get("/stats/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM links WHERE code = $1",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Not found");
    }

    const link = result.rows[0];

    res.render("stats", {
      code: link.code,
      url: link.url,
      clicks: link.clicks,
      last_clicked: link.last_clicked
        ? new Date(link.last_clicked).toLocaleString()
        : "Never",
      created_at: new Date(link.created_at).toLocaleString()
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.use("/api/links", linksRouter); // CRUD API
app.use("/healthz", healthRouter);  // Health check endpoint

/*
|--------------------------------------------------------------------------
| Redirect Short Links
| Must be BELOW all other routes
|--------------------------------------------------------------------------
*/
app.get("/:code", async (req, res) => {
  const { code } = req.params;

  // Avoid conflict with /stats
  if (code === "stats") {
    return res.status(404).send("Not found");
  }

  try {
    const result = await pool.query(
      "SELECT * FROM links WHERE code = $1",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Not found");
    }

    const link = result.rows[0];

    // Update click count and last clicked timestamp
    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
      [code]
    );

    return res.redirect(302, link.url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

/*
|--------------------------------------------------------------------------
| Local Development Only
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Local server running on http://localhost:${PORT}`)
);

/*
|--------------------------------------------------------------------------
| Export for Vercel
|--------------------------------------------------------------------------
*/
export default app;
