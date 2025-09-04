import { VercelRequest, VercelResponse } from "@vercel/node";
import express, { Request, Response } from "express";
import { sendSuccess, sendInternalServerError } from "./utils/response";
import { createLog, updateAppHealth } from "./integration";
import { sequelize } from "./config/database";
import { serverConfig } from "./config/index";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import apiRoutes from "./routes/index";

const app = express();
let server: any;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

app.use(
  cors({
    origin: "http://apphub.inabsolutions.com/",
  })
);

app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Service control endpoints
let isMaintenanceMode = false;
let isServiceStopped = false;

// Middleware to check service status (BEFORE routes)
app.use((req: Request, res: Response, next) => {
  // If service is stopped, only allow /start endpoint
  if (isServiceStopped) {
    if (req.path !== "/start") {
      res.status(503).json({
        success: false,
        message:
          "Service is currently stopped. Use POST /start to resume service.",
        statusCode: 503,
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }

  // If in maintenance mode, allow control endpoints but block API routes
  const allowedPathsInMaintenance = [
    "/health",
    "/start",
    "/stop",
    "/maintenance",
  ];
  if (isMaintenanceMode && !allowedPathsInMaintenance.includes(req.path)) {
    res.status(503).json({
      success: false,
      message: "Service is under maintenance",
      statusCode: 503,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
});

app.use("/api/v1", apiRoutes);

app.get("/", async (req: Request, res: Response) => {
  return sendSuccess(res, {
    message: "Hello, Setup for Applogger with Express on Vercel!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate();

    return sendSuccess(res, {
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error: any) {
    return sendInternalServerError(res, "Health check failed", {
      database: "disconnected",
      error: error.message,
    });
  }
});

app.post("/start", async (req: Request, res: Response) => {
  try {
    if (!isServiceStopped) {
      return sendSuccess(res, {
        message: "Service is already running",
        status: "running",
        timestamp: new Date().toISOString(),
      });
    }

    isServiceStopped = false;
    isMaintenanceMode = false;

    return sendSuccess(res, {
      message: "Service started successfully",
      status: "running",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return sendInternalServerError(
      res,
      "Failed to start service",
      error.message
    );
  }
});

app.post("/stop", async (req: Request, res: Response) => {
  try {
    isServiceStopped = true;

    return sendSuccess(res, {
      message: "Service stopped successfully",
      status: "stopped",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return sendInternalServerError(
      res,
      "Failed to stop service",
      error.message
    );
  }
});

app.post("/maintenance", async (req: Request, res: Response) => {
  try {
    const { enable } = req.body;
    isMaintenanceMode = enable !== false; // Default to true if not specified

    return sendSuccess(res, {
      message: `Maintenance mode ${isMaintenanceMode ? "enabled" : "disabled"}`,
      maintenanceMode: isMaintenanceMode,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return sendInternalServerError(
      res,
      "Failed to toggle maintenance mode",
      error.message
    );
  }
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log(
      "[SYNC] Connection to the database has been established successfully."
    );

    // await sequelize.sync({ force: true });
    return true;
  } catch (error) {
    console.error("[SYNC] Error connecting to database:", error);
    return false;
  }
}

async function startServer() {
  if (process.env.VERCEL !== "1") {
    const dbConnected = await initializeDatabase();
    if (!dbConnected) {
      console.error("Failed to connect to database in development mode");
      process.exit(1);
    }

    const PORT = serverConfig.port;
    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API Base: http://localhost:${PORT}/api/v1`);
    });
  }
}

if (process.env.VERCEL !== "1") {
  startServer();
}

export default async (req: VercelRequest, res: VercelResponse) => {
  await initializeDatabase();
  return app(req, res);
};
