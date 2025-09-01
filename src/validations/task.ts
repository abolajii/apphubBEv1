import { body, param, query } from "express-validator";

export const validateCreateTask = [
  body("appId")
    .notEmpty()
    .withMessage("Task appId is required")
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage("AppId must be exactly 6 characters (A-Z, 0-9)"),
  body("description")
    .notEmpty()
    .withMessage("Task description is required")
    .isString()
    .withMessage("Task description must be a string"),
  body("status")
    .optional()
    .isIn(["pending", "inprogress", "done"])
    .withMessage("Task status must be one of: pending, inprogress, done"),
  body("dateToFinish")
    .optional()
    .isISO8601()
    .withMessage("Date to finish must be a valid ISO 8601 date"),
];

export const validateUpdateTask = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Task ID must be a positive integer"),

  body("appId").optional(),
  body("description")
    .optional()
    .isString()
    .withMessage("Task description must be a string"),
  body("status")
    .optional()
    .isIn(["pending", "inprogress", "done"])
    .withMessage("Task status must be one of: pending, inprogress, done"),
  body("dateToFinish").optional(),
];

export const validateGetTask = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Task ID must be a positive integer"),
];

export const validateDeleteTask = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Task ID must be a positive integer"),
];

export const validateGetTasks = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
