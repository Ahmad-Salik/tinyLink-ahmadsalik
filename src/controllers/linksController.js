// src/controllers/linksController.js
import { pool } from "../db.js";
import { isValidUrl } from "./src/utils/validateUrl.js";
import { generateCode } from "./src/utils/generatecode.js";

/*
|--------------------------------------------------------------------------
| POST /api/links
| Create a new short link
|--------------------------------------------------------------------------
*/
async function createLink(req, res) {
  try {
    const { url, code } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid or missing URL" });
    }

    let shortCode = code && code.trim() !== "" ? code.trim() : generateCode();

    // Ensure custom code is not already used
    const exists = await pool.query(
      "SELECT 1 FROM links WHERE code = $1",
      [shortCode]
    );

    if (exists.rowCount > 0) {
      return res.status(409).json({ error: "Code already taken" });
    }

    // Insert new link
    const result = await pool.query(
      `INSERT INTO links (code, url) VALUES ($1, $2)
       RETURNING id, code, url, clicks, created_at`,
      [shortCode, url]
    );

    return res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

/*
|--------------------------------------------------------------------------
| GET /api/links
| List all links for dashboard
|--------------------------------------------------------------------------
*/
async function listLinks(req, res) {
  const result = await pool.query(
    "SELECT * FROM links ORDER BY created_at DESC"
  );
  res.json(result.rows);
}

/*
|--------------------------------------------------------------------------
| GET /api/links/:code
| Fetch a single link (used for stats or API access)
|--------------------------------------------------------------------------
*/
async function getLink(req, res) {
  const { code } = req.params;
  const result = await pool.query(
    "SELECT * FROM links WHERE code = $1",
    [code]
  );

  if (result.rowCount === 0)
    return res.status(404).json({ error: "Not found" });

  res.json(result.rows[0]);
}

/*
|--------------------------------------------------------------------------
| DELETE /api/links/:code
| Delete a short link
|--------------------------------------------------------------------------
*/
async function deleteLink(req, res) {
  const { code } = req.params;

  const result = await pool.query(
    "DELETE FROM links WHERE code = $1",
    [code]
  );

  if (result.rowCount === 0)
    return res.status(404).json({ error: "Not found" });

  res.json({ message: "Deleted" });
}

// Export all controller functions
export default {
  createLink,
  listLinks,
  getLink,
  deleteLink
};
