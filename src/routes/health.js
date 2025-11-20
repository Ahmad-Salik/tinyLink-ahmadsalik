import express from "express";
import os from "os";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    platform: os.platform(),
    memory: process.memoryUsage()
  });
});

export default router;
