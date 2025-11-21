// src/routes/links.js

import express from "express";
import linksController from "../controllers/linksController.js";

const router = express.Router();

// Destructure controller functions
const {
  createLink,
  listLinks,
  getLink,
  deleteLink
} = linksController;

/*
|--------------------------------------------------------------------------
| POST /api/links
| Create a new short link
|--------------------------------------------------------------------------
*/
router.post("/", createLink);

/*
|--------------------------------------------------------------------------
| GET /api/links
| List all short links
|--------------------------------------------------------------------------
*/
router.get("/", listLinks);

/*
|--------------------------------------------------------------------------
| GET /api/links/:code
| Get a single link (used by stats page or API)
|--------------------------------------------------------------------------
*/
router.get("/:code", getLink);

/*
|--------------------------------------------------------------------------
| DELETE /api/links/:code
| Delete a short link
|--------------------------------------------------------------------------
*/
router.delete("/:code", deleteLink);

export default router;
