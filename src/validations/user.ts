import { body, param, query } from "express-validator";

export const validateCreateUser = [
  body('username')
    .notEmpty()
    .withMessage('User username is required')
    .isString()
    .withMessage('User username must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('User username must be between 3 and 50 characters'),
  
  body('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('User email must be a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('User password is required')
    .isLength({ min: 6 })
    .withMessage('User password must be at least 6 characters'),
  
  body('firstName')
    .notEmpty()
    .withMessage('User firstName is required')
    .isString()
    .withMessage('User firstName must be a string'),
  
  body('lastName')
    .notEmpty()
    .withMessage('User lastName is required')
    .isString()
    .withMessage('User lastName must be a string'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('User role must be one of: admin, user, moderator'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('User isActive must be a boolean')
];

export const validateUpdateUser = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('User ID must be a positive integer'),
    
  body('username')
    .optional()
    .isString()
    .withMessage('User username must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('User username must be between 3 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('User email must be a valid email address'),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('User password must be at least 6 characters'),
  
  body('firstName')
    .optional()
    .isString()
    .withMessage('User firstName must be a string'),
  
  body('lastName')
    .optional()
    .isString()
    .withMessage('User lastName must be a string'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('User role must be one of: admin, user, moderator'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('User isActive must be a boolean')
];

export const validateGetUser = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('User ID must be a positive integer')
];

export const validateDeleteUser = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('User ID must be a positive integer')
];

export const validateGetUsers = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('User role filter must be one of: admin, user, moderator'),
    
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('User isActive filter must be a boolean')
];
