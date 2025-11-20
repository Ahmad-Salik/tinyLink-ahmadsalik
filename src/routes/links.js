import express from "express";
import linksController from "../controllers/linksController.js";

const router = express.Router();

// Destructure controller functions
const { createLink, listLinks, getLink, deleteLink } = linksController;

router.post("/", createLink);
router.get("/", listLinks);
router.get("/:code", getLink);
router.delete("/:code", deleteLink);

export default router;
