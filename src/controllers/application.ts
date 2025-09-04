import {
  sendSuccess,
  sendCreated,
  sendInternalServerError,
  sendNotFound,
  sendBadRequest,
} from "../utils/response";
import { Request, Response } from "express";
import { ApplicationService } from "../services/application";
import { validationResult } from "express-validator";

const ApplicationController = {
  add: async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendBadRequest(res, "Validation failed", {
          errors: errors.array(),
        });
      }

      // First check if application already exists
      const existingCheck = await ApplicationService.checkExisting({
        name: req.body.name,
        id: req.body.appId,
      });

      if (existingCheck.exists) {
        return sendBadRequest(res, existingCheck.message, {
          field: existingCheck.field,
        });
      }

      // Prepare data with uploaded files
      const applicationData = { ...req.body };

      // Handle uploaded files if present
      if (req.files && typeof req.files === "object") {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        // Add small images files to data
        if (files.smallImages) {
          applicationData.smallImages = files.smallImages;
        }

        // Add large images files to data
        if (files.largeImages) {
          applicationData.largeImages = files.largeImages;
        }
      }

      // Proceed to create application
      const result = await ApplicationService.add(applicationData);
      return sendCreated(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.add]", err);
      if (err.name === "SequelizeUniqueConstraintError") {
        return sendBadRequest(
          res,
          "Application name or id already exists",
          err.errors
        );
      }
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

      const { appId } = req.params;

      if (!appId) {
        return sendBadRequest(res, "Application ID is required");
      }

      const result = await ApplicationService.get(appId);

      if (!result.success) {
        return sendNotFound(res, result.message);
      }

      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.get]", err);
      return sendInternalServerError(res, "Get operation failed", err.message);
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const result = await ApplicationService.getAll();
      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.getAll]", err);
      return sendInternalServerError(
        res,
        "GetAll operation failed",
        err.message
      );
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendBadRequest(res, "Validation failed", {
          errors: errors.array(),
        });
      }

      const { appId } = req.params;

      if (!appId) {
        return sendBadRequest(res, "Application ID is required");
      }

      // Check if this is a multipart request with files
      const hasFiles =
        req.files &&
        typeof req.files === "object" &&
        Object.keys(req.files).length > 0;

      if (hasFiles) {
        // Handle as multipart with images
        console.log("[INFO] Handling multipart update with images");

        // Parse existing images from request body
        let existingImages = { small: [], large: [] };
        if (req.body.existingImages) {
          try {
            existingImages =
              typeof req.body.existingImages === "string"
                ? JSON.parse(req.body.existingImages)
                : req.body.existingImages;
          } catch (error) {
            console.log("Error parsing existing images:", error);
          }
        }

        // Handle new image uploads
        const uploadedImages: { small: string[]; large: string[] } = {
          small: [],
          large: [],
        };

        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        // Process new small images
        if (files.newSmallImages) {
          for (const file of files.newSmallImages) {
            const uploadResult = await ApplicationService.uploadAndSaveImage({
              file: file.buffer,
              fileName: file.originalname,
              applicationId: appId,
              imageType: "small",
            });

            if (uploadResult.success) {
              uploadedImages.small.push(uploadResult.data.url);
            }
          }
        }

        // Process new large images
        if (files.newLargeImages) {
          for (const file of files.newLargeImages) {
            const uploadResult = await ApplicationService.uploadAndSaveImage({
              file: file.buffer,
              fileName: file.originalname,
              applicationId: appId,
              imageType: "large",
            });

            if (uploadResult.success) {
              uploadedImages.large.push(uploadResult.data.url);
            }
          }
        }

        // Combine existing images with newly uploaded ones
        const combinedImages = {
          small: [...(existingImages.small || []), ...uploadedImages.small],
          large: [...(existingImages.large || []), ...uploadedImages.large],
        };

        // Prepare update data with images
        const updateData = { ...req.body };
        updateData.images = combinedImages;

        // Remove file-related metadata fields
        delete updateData.existingImages;

        // Update the application
        const result = await ApplicationService.update(appId, updateData);

        if (!result.success) {
          return sendNotFound(res, result.message);
        }

        return sendSuccess(res, result.data, result.message);
      } else {
        // Handle as regular JSON update
        console.log("[INFO] Handling regular JSON update");

        const result = await ApplicationService.update(appId, req.body);

        if (!result.success) {
          return sendNotFound(res, result.message);
        }

        return sendSuccess(res, result.data, result.message);
      }
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.update]", err);
      return sendInternalServerError(
        res,
        "Update operation failed",
        err.message
      );
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { appId } = req.params;

      if (!appId) {
        return sendBadRequest(res, "Application ID is required");
      }

      const result = await ApplicationService.delete(appId);

      if (!result.success) {
        return sendNotFound(res, result.message);
      }

      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.delete]", err);
      return sendInternalServerError(
        res,
        "Delete operation failed",
        err.message
      );
    }
  },

  generateAppId: async (req: Request, res: Response) => {
    try {
      const result = await ApplicationService.generateAppId();
      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.generateAppId]", err);
      return sendInternalServerError(
        res,
        "Generate AppId operation failed",
        err.message
      );
    }
  },

  createSampleData: async (req: Request, res: Response) => {
    try {
      const { appId } = req.params;

      if (!appId) {
        return sendBadRequest(res, "Application ID is required");
      }

      const result = await ApplicationService.createSampleData(appId);

      if (!result.success) {
        return sendNotFound(res, result.message);
      }

      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.createSampleData]", err);
      return sendInternalServerError(
        res,
        "Create sample data operation failed",
        err.message
      );
    }
  },

  uploadImage: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return sendBadRequest(res, "No file uploaded");
      }

      const fileName = req.file.originalname;
      const file = req.file.buffer;
      const { applicationId, imageType } = req.body;

      const result = await ApplicationService.uploadAndSaveImage({
        file,
        fileName,
        applicationId,
        imageType: imageType || "large",
      });

      if (!result.success) {
        return sendBadRequest(res, result.message, result.error);
      }

      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.uploadImage]", err);
      return sendInternalServerError(res, "Image upload failed", err.message);
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendBadRequest(res, "Validation failed", {
          errors: errors.array(),
        });
      }

      const { appId } = req.params;
      const { status } = req.body;

      if (!appId) {
        return sendBadRequest(res, "Application ID is required");
      }

      if (!status) {
        return sendBadRequest(res, "Status is required");
      }

      // Validate status value
      const validStatuses = ["running", "stopped", "maintenance"];
      if (!validStatuses.includes(status)) {
        return sendBadRequest(
          res,
          `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        );
      }

      const result = await ApplicationService.updateStatus(appId, status);

      if (!result.success) {
        return sendNotFound(res, result.message);
      }

      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.updateStatus]", err);
      return sendInternalServerError(
        res,
        "Update status operation failed",
        err.message
      );
    }
  },

  healthUpdate: async (req: Request, res: Response) => {
    try {
      const { appId, healthy } = req.body;

      // Validate required fields
      if (!appId) {
        return sendBadRequest(res, "Application ID is required");
      }

      if (typeof healthy !== "boolean") {
        return sendBadRequest(res, "Healthy status must be a boolean value");
      }

      const result = await ApplicationService.updateHealth(appId, healthy);

      if (!result.success) {
        return sendNotFound(res, result.message);
      }

      return sendSuccess(res, result.data, result.message);
    } catch (err: any) {
      console.log("[ERROR - ApplicationController.healthUpdate]", err);
      return sendInternalServerError(
        res,
        "Health update operation failed",
        err.message
      );
    }
  },
};

export { ApplicationController };
