import {
  sendSuccess,
  sendCreated,
  sendInternalServerError,
  sendNotFound,
  sendBadRequest,
} from "../utils/response";
import { Request, Response } from "express";
import { LogService } from "../services/log";
import { validationResult } from "express-validator";

const LogController = {
  add: async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendBadRequest(res, "Validation failed", {
          errors: errors.array(),
        });
      }

      const result = await LogService.add(req.body);

      if (!result.success) {
        return sendBadRequest(res, result.message);
      }

      return sendCreated(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - LogController.add]", err);
      return sendInternalServerError(res, "Add operation failed", err.message);
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendBadRequest(res, "Validation failed", {
          errors: errors.array(),
        });
      }

      const result = await LogService.get(req.params.id);

      if (!result.success) {
        return sendNotFound(res, result.message);
      }

      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - LogController.get]", err);
      return sendInternalServerError(res, "Get operation failed", err.message);
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const { appId, logType, search, limit, page } = req.query;

      const params = {
        ...(appId && { appId: appId as string }),
        ...(logType && { logType: logType as string }),
        ...(search && { search: search as string }),
        ...(limit && { limit: parseInt(limit as string) }),
        ...(page && { page: parseInt(page as string) }),
      };

      const result = await LogService.getAll(params);

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
        pagination: result.pagination,
        counts: result.counts,
      });
    } catch (err: any) {
      console.log("[ERROR - LogController.getAll]", err);
      return sendInternalServerError(
        res,
        "GetAll operation failed",
        err.message
      );
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      return sendSuccess(res, {
        message: "Welcome to Update endpoint from LogController",
      });
    } catch (err: any) {
      console.log("[ERROR - LogController.update]", err);
      return sendInternalServerError(
        res,
        "Update operation failed",
        err.message
      );
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      return sendSuccess(res, {
        message: "Welcome to Delete endpoint from LogController",
      });
    } catch (err: any) {
      console.log("[ERROR - LogController.delete]", err);
      return sendInternalServerError(
        res,
        "Delete operation failed",
        err.message
      );
    }
  },

  getTrends: async (req: Request, res: Response) => {
    try {
      const { appId, days, logType } = req.query;

      const params = {
        ...(appId && { appId: appId as string }),
        ...(days && { days: parseInt(days as string) }),
        ...(logType && { logType: logType as string }),
      };

      const result = await LogService.getTrends(params);

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
      });
    } catch (err: any) {
      console.log("[ERROR - LogController.getTrends]", err);
      return sendInternalServerError(
        res,
        "Get trends operation failed",
        err.message
      );
    }
  },

  getAnalytics: async (req: Request, res: Response) => {
    try {
      const { appId, days } = req.query;

      const params = {
        ...(appId && { appId: appId as string }),
        ...(days && { days: parseInt(days as string) }),
      };

      const result = await LogService.getAnalytics(params);

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
      });
    } catch (err: any) {
      console.log("[ERROR - LogController.getAnalytics]", err);
      return sendInternalServerError(
        res,
        "Get analytics operation failed",
        err.message
      );
    }
  },

  deleteById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await LogService.deleteById(id);

      if (!result.success) {
        return sendNotFound(res, result.message);
      }

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
      });
    } catch (err: any) {
      console.log("[ERROR - LogController.deleteById]", err);
      return sendInternalServerError(
        res,
        "Delete operation failed",
        err.message
      );
    }
  },

  deleteBulk: async (req: Request, res: Response) => {
    try {
      const { logIds } = req.body;

      if (!logIds || !Array.isArray(logIds)) {
        return sendInternalServerError(
          res,
          "Invalid request",
          "logIds must be an array"
        );
      }

      const result = await LogService.deleteBulk(logIds);

      if (!result.success) {
        return sendInternalServerError(
          res,
          "Bulk delete failed",
          result.message
        );
      }

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
      });
    } catch (err: any) {
      console.log("[ERROR - LogController.deleteBulk]", err);
      return sendInternalServerError(
        res,
        "Bulk delete operation failed",
        err.message
      );
    }
  },

  deleteAllLogs: async (req: Request, res: Response) => {
    try {
      const { appId } = req.query;
      const result = await LogService.deleteAll(appId as string);

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
      });
    } catch (err: any) {
      console.log("[ERROR - LogController.deleteAllLogs]", err);
      return sendInternalServerError(
        res,
        "Delete all operation failed",
        err.message
      );
    }
  },
};

export { LogController };
