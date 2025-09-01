import { body, param, query } from "express-validator";

export const validateCreateApplication = [
  body("name")
    .notEmpty()
    .withMessage("Application name is required")
    .isString()
    .withMessage("Application name must be a string"),
  body("bg")
    .optional()
    .isString()
    .withMessage("Application bg must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Application description must be a string"),
  body("link")
    .optional()
    .isString()
    .withMessage("Application link must be a string"),
  body("stacks").optional(),
  body("onGoing")
    .optional()
    .isBoolean()
    .withMessage("Application onGoing must be a boolean"),
  body("appId")
    .optional()
    .isString()
    .withMessage("Application appId must be a string")
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage(
      "Application appId must be 6 alphanumeric characters (e.g., A1B2C3)"
    ),
  body("status")
    .optional()
    .isIn(["running", "stopped", "maintenance"])
    .withMessage(
      "Application status must be one of: running, stopped, maintenance"
    ),
  body("uptime")
    .optional()
    .isNumeric()
    .withMessage("Application uptime must be a number"),
  body("downtime")
    .optional()
    .isNumeric()
    .withMessage("Application downtime must be a number"),
  body("lastChecked").optional(),
  body("githubUrl")
    .optional()
    .isString()
    .withMessage("Application githubUrl must be a string"),
  body("frontendUrl")
    .optional()
    .isString()
    .withMessage("Application frontendUrl must be a string"),
  body("backendUrl")
    .optional()
    .isString()
    .withMessage("Application backendUrl must be a string"),
  body("images").optional(),
];

export const validateUpdateApplication = [
  param("appId")
    .notEmpty()
    .withMessage("Application ID is required")
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage(
      "Application ID must be 6 alphanumeric characters (e.g., A1B2C3)"
    ),

  body("bg")
    .optional()
    .isString()
    .withMessage("Application bg must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Application description must be a string"),
  body("name")
    .optional()
    .isString()
    .withMessage("Application name must be a string"),
  body("link")
    .optional()
    .isString()
    .withMessage("Application link must be a string"),
  body("stacks").optional(),
  body("onGoing")
    .optional()
    .isBoolean()
    .withMessage("Application onGoing must be a boolean"),
  body("appId")
    .optional()
    .isString()
    .withMessage("Application appId must be a string")
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage(
      "Application appId must be 6 alphanumeric characters (e.g., A1B2C3)"
    ),
  body("status")
    .optional()
    .isIn(["running", "stopped", "maintenance"])
    .withMessage(
      "Application status must be one of: running, stopped, maintenance"
    ),
  body("uptime")
    .optional()
    .isNumeric()
    .withMessage("Application uptime must be a number"),
  body("downtime")
    .optional()
    .isNumeric()
    .withMessage("Application downtime must be a number"),
  body("lastChecked").optional(),
  body("githubUrl")
    .optional()
    .isString()
    .withMessage("Application githubUrl must be a string"),
  body("frontendUrl")
    .optional()
    .isString()
    .withMessage("Application frontendUrl must be a string"),
  body("backendUrl")
    .optional()
    .isString()
    .withMessage("Application backendUrl must be a string"),
  body("images").optional(),
];

export const validateGetApplication = [
  param("appId")
    .notEmpty()
    .withMessage("Application ID is required")
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage(
      "Application ID must be 6 alphanumeric characters (e.g., A1B2C3)"
    ),
];

export const validateDeleteApplication = [
  param("appId")
    .notEmpty()
    .withMessage("Application ID is required")
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage(
      "Application ID must be 6 alphanumeric characters (e.g., A1B2C3)"
    ),
];

export const validateGetApplications = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

export const validateUpdateStatus = [
  param("appId")
    .notEmpty()
    .withMessage("Application ID is required")
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage(
      "Application ID must be 6 alphanumeric characters (e.g., A1B2C3)"
    ),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["running", "stopped", "maintenance"])
    .withMessage("Status must be one of: running, stopped, maintenance"),
];
