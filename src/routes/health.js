// src/routes/health.js

import express from "express";
import os from "os";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET /healthz
| Health check endpoint for uptime monitoring
|--------------------------------------------------------------------------
*/
router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",                 // API status
    uptime: process.uptime(),     // How long the process has been running
    timestamp: new Date().toISOString(),
    platform: os.platform(),      // Server OS
    memory: process.memoryUsage() // Memory info
  });
});

export default router;
