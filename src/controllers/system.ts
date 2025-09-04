import {
  sendSuccess,
  sendCreated,
  sendInternalServerError,
  sendNotFound,
} from "../utils/response";
import { Request, Response } from "express";
import { SystemService } from "../services/system";

const SystemController = {
  deleteAll: async (req: Request, res: Response) => {
    try {
      const { model } = req.query;
      const result = await SystemService.deleteAll(model as string);

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
      });
    } catch (err: any) {
      console.log("[ERROR - SystemController.deleteAll]", err);
      return sendInternalServerError(
        res,
        "Delete operation failed",
        err.message
      );
    }
  },

  getCounts: async (req: Request, res: Response) => {
    try {
      const counts = await SystemService.getCounts();

      return sendSuccess(res, {
        message: "System counts retrieved successfully",
        data: counts,
      });
    } catch (err: any) {
      console.log("[ERROR - SystemController.getCounts]", err);
      return sendInternalServerError(
        res,
        "Get counts operation failed",
        err.message
      );
    }
  },

  resetSystem: async (req: Request, res: Response) => {
    try {
      const result = await SystemService.resetSystem();

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
      });
    } catch (err: any) {
      console.log("[ERROR - SystemController.resetSystem]", err);
      return sendInternalServerError(
        res,
        "Reset operation failed",
        err.message
      );
    }
  },

  getSystemHealth: async (req: Request, res: Response) => {
    try {
      const health = await SystemService.getSystemHealth();

      return sendSuccess(res, {
        message: "System health check completed",
        data: health,
      });
    } catch (err: any) {
      console.log("[ERROR - SystemController.getSystemHealth]", err);
      return sendInternalServerError(res, "Health check failed", err.message);
    }
  },

  getSystemStats: async (req: Request, res: Response) => {
    try {
      const stats = await SystemService.getSystemStats();

      return sendSuccess(res, {
        message: "System statistics retrieved successfully",
        data: stats,
      });
    } catch (err: any) {
      console.log("[ERROR - SystemController.getSystemStats]", err);
      return sendInternalServerError(
        res,
        "Get stats operation failed",
        err.message
      );
    }
  },

  exportData: async (req: Request, res: Response) => {
    try {
      const { models } = req.query;
      const modelArray = models ? (models as string).split(",") : undefined;

      const exportResult = await SystemService.exportData(modelArray);

      return sendSuccess(res, {
        message: "Data exported successfully",
        data: exportResult,
      });
    } catch (err: any) {
      console.log("[ERROR - SystemController.exportData]", err);
      return sendInternalServerError(
        res,
        "Export operation failed",
        err.message
      );
    }
  },

  getSystemMetrics: async (req: Request, res: Response) => {
    try {
      const metrics = await SystemService.getSystemMetrics();

      return sendSuccess(res, {
        message: "System metrics retrieved successfully",
        ...metrics,
      });
    } catch (err: any) {
      console.log("[ERROR - SystemController.getSystemMetrics]", err);
      return sendInternalServerError(
        res,
        "Failed to retrieve system metrics",
        err.message
      );
    }
  },
};

export default SystemController;
