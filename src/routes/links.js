import express from "express";
const { createLink, listLinks, getLink, deleteLink } = links;
const router = express.Router();

router.post("/", createLink);
router.get("/", listLinks);
router.get("/:code", getLink);
router.delete("/:code", deleteLink);

export default router;
