import { sendSuccess, sendCreated, sendInternalServerError, sendNotFound, sendBadRequest } from "../utils/response";
import { Request, Response } from "express";
import { UserService } from "../services/user";

const UserController = {
  add: async (req: Request, res: Response) => {
    try {
      // First check if user already exists
      const existingCheck = await UserService.checkExisting({
        username: req.body.username,
        email: req.body.email
      });

      if (existingCheck.exists) {
        return sendBadRequest(res, existingCheck.message, { field: existingCheck.field });
      }

      // Proceed to create user
      const result = await UserService.add(req.body);
      return sendCreated(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - UserController.add]", err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return sendBadRequest(res, "Username or email already exists", err.errors);
      }
      return sendInternalServerError(res, "Add operation failed", err.message);
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      return sendSuccess(res, { message: "Welcome to Get endpoint from UserController" });
    } catch (err: any) {
      console.log("[ERROR - UserController.get]", err);
      return sendInternalServerError(res, "Get operation failed", err.message);
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      return sendSuccess(res, { message: "Welcome to GetAll endpoint from UserController" });
    } catch (err: any) {
      console.log("[ERROR - UserController.getAll]", err);
      return sendInternalServerError(res, "GetAll operation failed", err.message);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      return sendSuccess(res, { message: "Welcome to Update endpoint from UserController" });
    } catch (err: any) {
      console.log("[ERROR - UserController.update]", err);
      return sendInternalServerError(res, "Update operation failed", err.message);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      return sendSuccess(res, { message: "Welcome to Delete endpoint from UserController" });
    } catch (err: any) {
      console.log("[ERROR - UserController.delete]", err);
      return sendInternalServerError(res, "Delete operation failed", err.message);
    }
  },

  entry: async (req: Request, res: Response) => {
    try {
      return sendSuccess(res, { message: "Welcome to User entry!" });
    } catch (err: any) {
      console.log("[ERROR - UserController.entry]", err);
      return sendInternalServerError(res, "Entry operation failed", err.message);
    }
  },

};

export { UserController };
