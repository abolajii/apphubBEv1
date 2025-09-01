import {
  sendSuccess,
  sendCreated,
  sendInternalServerError,
  sendNotFound,
  sendBadRequest,
} from "../utils/response";
import { Request, Response } from "express";
import { ReviewService } from "../services/review";
import { validationResult } from "express-validator";

const ReviewController = {
  add: async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendBadRequest(res, "Validation failed", {
          errors: errors.array(),
        });
      }

      const result = await ReviewService.add(req.body);

      if (!result.success) {
        return sendBadRequest(res, result.message);
      }

      return sendCreated(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ReviewController.add]", err);
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

      const result = await ReviewService.get(req.params.id);

      if (!result.success) {
        return sendNotFound(res, result.message);
      }

      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ReviewController.get]", err);
      return sendInternalServerError(res, "Get operation failed", err.message);
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const { appId, rating, search, limit, page } = req.query;

      const params = {
        ...(appId && { appId: appId as string }),
        ...(rating && { rating: parseInt(rating as string) }),
        ...(search && { search: search as string }),
        ...(limit && { limit: parseInt(limit as string) }),
        ...(page && { page: parseInt(page as string) }),
      };

      const result = await ReviewService.getAll(params);

      return sendSuccess(res, {
        message: result.message,
        data: result.data,
        pagination: result.pagination,
        ratingStats: result.ratingStats,
      });
    } catch (err: any) {
      console.log("[ERROR - ReviewController.getAll]", err);
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
        message: "Welcome to Update endpoint from ReviewController",
      });
    } catch (err: any) {
      console.log("[ERROR - ReviewController.update]", err);
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
        message: "Welcome to Delete endpoint from ReviewController",
      });
    } catch (err: any) {
      console.log("[ERROR - ReviewController.delete]", err);
      return sendInternalServerError(
        res,
        "Delete operation failed",
        err.message
      );
    }
  },
};

export { ReviewController };
