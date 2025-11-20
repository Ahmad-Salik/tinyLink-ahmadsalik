// src/controllers/linksController.js
import { pool } from "../db.js";
import { isValidUrl } from "../utils/validateUrl.js";
import { generateCode } from "../utils/generatecode.js";

async function createLink(req, res) {
  let { url, code } = req.body;

  if (!isValidUrl(url)) return res.status(400).json({ error: "Invalid URL" });

  if (!code) code = generateCode();

  const pattern = /^[A-Za-z0-9]{6,8}$/;
  if (!pattern.test(code)) return res.status(400).json({ error: "Invalid code format" });

  try {
    await pool.query(
      "INSERT INTO links (url, code) VALUES ($1, $2)",
      [url, code]
    );
    return res.json({ url, code });
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "Code already exists" });
    return res.status(500).json({ error: "Server error" });
  }
}

async function listLinks(req, res) {
  const result = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
  res.json(result.rows);
}

async function getLink(req, res) {
  const { code } = req.params;
  const result = await pool.query("SELECT * FROM links WHERE code = $1", [code]);

  if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });

  res.json(result.rows[0]);
}

async function deleteLink(req, res) {
  const { code } = req.params;

  const result = await pool.query("DELETE FROM links WHERE code = $1", [code]);

  if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });

  res.json({ message: "Deleted" });
}

export default {
  createLink,
  listLinks,
  getLink,
  deleteLink
};
