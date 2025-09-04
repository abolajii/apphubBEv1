import { VercelRequest, VercelResponse } from "@vercel/node";
import express, { Request, Response } from "express";
import { sendSuccess, sendInternalServerError } from "./utils/response";
import { createLog, updateAppHealth } from "./integration";
import { sequelize } from "./config/database";
import { serverConfig, appConfig } from "./config/index";

import cors, { CorsOptions } from "cors";
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
  skip: (req: Request) => req.method === "OPTIONS",
});
app.use("/api/", limiter);

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const allowedOrigins = [
      "https://apphub.inabsolutions.com",
      "http://apphub.inabsolutions.com",
      "http://localhost:5174",
    ];

    if (!origin) {
      return callback(null, true);
    }

    try {
      const host = new URL(origin).host;
      const isAllowed =
        allowedOrigins.includes(origin) || /\.vercel\.app$/i.test(host);

      return callback(null, isAllowed);
    } catch (_e) {
      // If parsing fails, deny
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Handle preflight without a path pattern to avoid path-to-regexp issues
app.use((req: Request, res: Response, next): void => {
  if (req.method === "OPTIONS") {
    const requestOrigin = (req.headers["origin"] as string) || "*";
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Vary", "Origin");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.status(204).end();
    return;
  }
  next();
});

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
  const startTime = Date.now();
  try {
    await sequelize.authenticate();

    const responseTime = Date.now() - startTime;
    const healthData = {
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    // Log the health check
    createLog(appConfig.appId, appConfig.appName || "System Health Monitor", {
      logType: "info",
      message: "Health check successful - database connected",
      statusCode: 200,
      responseTime,
      endpoint: "/health",
      method: "GET",
      additionalData: {
        database: "connected",
        systemUptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    }).catch((err) => console.log("[WARN] Failed to log health check:", err));

    return sendSuccess(res, healthData);
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // Log the health check failure
    createLog(appConfig.appId, appConfig.appName || "System Health Monitor", {
      logType: "error",
      message: "Health check failed - database disconnected",
      statusCode: 500,
      responseTime,
      endpoint: "/health",
      method: "GET",
      additionalData: {
        database: "disconnected",
        error: error.message,
        systemUptime: process.uptime(),
      },
    }).catch((err) =>
      console.log("[WARN] Failed to log health check error:", err)
    );

    return sendInternalServerError(res, "Health check failed", {
      database: "disconnected",
      error: error.message,
    });
  }
});

app.post("/start", async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    if (!isServiceStopped) {
      const responseTime = Date.now() - startTime;
      const responseData = {
        message: "Service is already running",
        status: "running",
        timestamp: new Date().toISOString(),
      };

      // Log service already running
      createLog(
        appConfig.appId,
        appConfig.appName || "System Service Controller",
        {
          logType: "info",
          message: "Service start requested but already running",
          statusCode: 200,
          responseTime,
          endpoint: "/start",
          method: "POST",
          additionalData: {
            previousStatus: "running",
            action: "start_requested",
          },
        }
      ).catch((err) => console.log("[WARN] Failed to log start request:", err));

      return sendSuccess(res, responseData);
    }

    isServiceStopped = false;
    isMaintenanceMode = false;

    const responseTime = Date.now() - startTime;
    const responseData = {
      message: "Service started successfully",
      status: "running",
      timestamp: new Date().toISOString(),
    };

    // Log service start
    createLog(
      appConfig.appId,
      appConfig.appName || "System Service Controller",
      {
        logType: "success",
        message: "Service started successfully",
        statusCode: 200,
        responseTime,
        endpoint: "/start",
        method: "POST",
        additionalData: {
          previousStatus: "stopped",
          newStatus: "running",
          maintenanceMode: false,
          action: "service_started",
        },
      }
    ).catch((err) => console.log("[WARN] Failed to log service start:", err));

    return sendSuccess(res, responseData);
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // Log service start error
    createLog(
      appConfig.appId,
      appConfig.appName || "System Service Controller",
      {
        logType: "error",
        message: "Failed to start service",
        statusCode: 500,
        responseTime,
        endpoint: "/start",
        method: "POST",
        additionalData: {
          error: error.message,
          action: "service_start_failed",
        },
      }
    ).catch((err) =>
      console.log("[WARN] Failed to log service start error:", err)
    );

    return sendInternalServerError(
      res,
      "Failed to start service",
      error.message
    );
  }
});

app.post("/stop", async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    isServiceStopped = true;
    const responseTime = Date.now() - startTime;
    const responseData = {
      message: "Service stopped successfully",
      status: "stopped",
      timestamp: new Date().toISOString(),
    };

    // Log service stop
    createLog(
      appConfig.appId,
      appConfig.appName || "System Service Controller",
      {
        logType: "warning",
        message: "Service stopped by admin request",
        statusCode: 200,
        responseTime,
        endpoint: "/stop",
        method: "POST",
        additionalData: {
          previousStatus: "running",
          newStatus: "stopped",
          action: "service_stopped",
          adminAction: true,
        },
      }
    ).catch((err) => console.log("[WARN] Failed to log service stop:", err));

    return sendSuccess(res, responseData);
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // Log service stop error
    createLog(
      appConfig.appId,
      appConfig.appName || "System Service Controller",
      {
        logType: "error",
        message: "Failed to stop service",
        statusCode: 500,
        responseTime,
        endpoint: "/stop",
        method: "POST",
        additionalData: {
          error: error.message,
          action: "service_stop_failed",
        },
      }
    ).catch((err) =>
      console.log("[WARN] Failed to log service stop error:", err)
    );

    return sendInternalServerError(
      res,
      "Failed to stop service",
      error.message
    );
  }
});

app.post("/maintenance", async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { enable } = req.body;
    const previousMode = isMaintenanceMode;
    isMaintenanceMode = enable !== false; // Default to true if not specified

    const responseTime = Date.now() - startTime;
    const responseData = {
      message: `Maintenance mode ${isMaintenanceMode ? "enabled" : "disabled"}`,
      maintenanceMode: isMaintenanceMode,
      timestamp: new Date().toISOString(),
    };

    // Log maintenance mode toggle
    createLog(
      appConfig.appId,
      appConfig.appName || "System Service Controller",
      {
        logType: "info",
        message: `Maintenance mode ${
          isMaintenanceMode ? "enabled" : "disabled"
        } by admin`,
        statusCode: 200,
        responseTime,
        endpoint: "/maintenance",
        method: "POST",
        additionalData: {
          previousMaintenanceMode: previousMode,
          newMaintenanceMode: isMaintenanceMode,
          action: isMaintenanceMode
            ? "maintenance_enabled"
            : "maintenance_disabled",
          adminAction: true,
          requestBody: req.body,
        },
      }
    ).catch((err) =>
      console.log("[WARN] Failed to log maintenance toggle:", err)
    );

    return sendSuccess(res, responseData);
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // Log maintenance mode toggle error
    createLog(
      appConfig.appId,
      appConfig.appName || "System Service Controller",
      {
        logType: "error",
        message: "Failed to toggle maintenance mode",
        statusCode: 500,
        responseTime,
        endpoint: "/maintenance",
        method: "POST",
        additionalData: {
          error: error.message,
          action: "maintenance_toggle_failed",
          requestBody: req.body,
        },
      }
    ).catch((err) =>
      console.log("[WARN] Failed to log maintenance error:", err)
    );

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
