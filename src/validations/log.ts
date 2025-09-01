import { body, param, query } from "express-validator";

export const validateCreateLog = [
  body("appId").notEmpty().withMessage("Log appId is required"),
  body("appName")
    .notEmpty()
    .withMessage("Log appName is required")
    .isString()
    .withMessage("Log appName must be a string"),
  body("logType")
    .notEmpty()
    .withMessage("Log logType is required")
    .isIn(["success", "error", "info", "warning"])
    .withMessage("Log logType must be one of: success, error, info, warning"),
  body("message")
    .notEmpty()
    .withMessage("Log message is required")
    .isString()
    .withMessage("Log message must be a string"),
  body("statusCode")
    .notEmpty()
    .withMessage("Log statusCode is required")
    .isNumeric()
    .withMessage("Log statusCode must be a number"),
  body("responseTime")
    .notEmpty()
    .withMessage("Log responseTime is required")
    .isNumeric()
    .withMessage("Log responseTime must be a number"),
  body("endpoint")
    .notEmpty()
    .withMessage("Log endpoint is required")
    .isString()
    .withMessage("Log endpoint must be a string"),
  body("userAgent")
    .notEmpty()
    .withMessage("Log userAgent is required")
    .isString()
    .withMessage("Log userAgent must be a string"),
  body("ip")
    .notEmpty()
    .withMessage("Log ip is required")
    .isString()
    .withMessage("Log ip must be a string"),
  body("method")
    .notEmpty()
    .withMessage("Log method is required")
    .isIn(["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
    .withMessage(
      "Log method must be one of: GET, POST, PUT, DELETE, PATCH, OPTIONS"
    ),
  body("additionalData")
    .optional()
    .custom((value) => {
      if (value !== null && value !== undefined) {
        try {
          if (typeof value === "string") {
            JSON.parse(value);
          } else if (typeof value === "object") {
            // Already an object, which is fine
            return true;
          } else {
            throw new Error("Invalid format");
          }
        } catch (error) {
          throw new Error("Additional data must be valid JSON");
        }
      }
      return true;
    }),
];

export const validateUpdateLog = [
  param("id").isInt({ gt: 0 }).withMessage("Log ID must be a positive integer"),

  body("appId").optional(),
  body("appName")
    .optional()
    .isString()
    .withMessage("Log appName must be a string"),
  body("logType")
    .optional()
    .isIn(["success", "error", "info", "warning"])
    .withMessage("Log logType must be one of: success, error, info, warning"),
  body("message")
    .optional()
    .isString()
    .withMessage("Log message must be a string"),
  body("statusCode")
    .optional()
    .isNumeric()
    .withMessage("Log statusCode must be a number"),
  body("responseTime")
    .optional()
    .isNumeric()
    .withMessage("Log responseTime must be a number"),
  body("endpoint")
    .optional()
    .isString()
    .withMessage("Log endpoint must be a string"),
  body("userAgent")
    .optional()
    .isString()
    .withMessage("Log userAgent must be a string"),
  body("ip").optional().isString().withMessage("Log ip must be a string"),
  body("method")
    .optional()
    .isIn(["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
    .withMessage(
      "Log method must be one of: GET, POST, PUT, DELETE, PATCH, OPTIONS"
    ),
];

export const validateGetLog = [
  param("id").isInt({ gt: 0 }).withMessage("Log ID must be a positive integer"),
];

export const validateDeleteLog = [
  param("id").isInt({ gt: 0 }).withMessage("Log ID must be a positive integer"),
];

export const validateGetLogs = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

export const validateGetTrends = [
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Days must be between 1 and 365"),

  query("appId").optional().isString().withMessage("App ID must be a string"),

  query("logType")
    .optional()
    .isIn(["success", "error", "info", "warning"])
    .withMessage("Log type must be one of: success, error, info, warning"),
];

export const validateGetAnalytics = [
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Days must be between 1 and 365"),

  query("appId").optional().isString().withMessage("App ID must be a string"),
];

export const validateDeleteBulk = [
  body("logIds")
    .isArray({ min: 1 })
    .withMessage("logIds must be a non-empty array"),

  body("logIds.*").isString().withMessage("Each log ID must be a string"),
];

export const validateDeleteAll = [
  query("appId").optional().isString().withMessage("App ID must be a string"),
];
