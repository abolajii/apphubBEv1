import {
  sendSuccess,
  sendCreated,
  sendInternalServerError,
  sendNotFound,
  sendBadRequest,
} from "../utils/response";
import { Request, Response } from "express";
import { TaskService } from "../services/task";
import { validationResult } from "express-validator";

const TaskController = {
  add: async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendBadRequest(res, "Validation failed", {
          errors: errors.array(),
        });
      }

      const result = await TaskService.add(req.body);

      if (!result.success) {
        return sendBadRequest(res, result.message);
      }

      return sendCreated(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - TaskController.add]", err);
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

      const result = await TaskService.get(req.params.id);

      if (!result.success) {
        return sendNotFound(res, result.message);
      }

      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - TaskController.get]", err);
      return sendInternalServerError(res, "Get operation failed", err.message);
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const { appId, status, search, limit, page } = req.query;

      const params = {
        ...(appId && { appId: appId as string }),
        ...(status && { status: status as string }),
        ...(search && { search: search as string }),
        ...(limit && { limit: parseInt(limit as string) }),
        ...(page && { page: parseInt(page as string) }),
      };

      const result = await TaskService.getAll(params);

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
        pagination: result.pagination,
        counts: result.counts,
      });
    } catch (err: any) {
      console.log("[ERROR - TaskController.getAll]", err);
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
        message: "Welcome to Update endpoint from TaskController",
      });
    } catch (err: any) {
      console.log("[ERROR - TaskController.update]", err);
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
        message: "Welcome to Delete endpoint from TaskController",
      });
    } catch (err: any) {
      console.log("[ERROR - TaskController.delete]", err);
      return sendInternalServerError(
        res,
        "Delete operation failed",
        err.message
      );
    }
  },
};

export { TaskController };
