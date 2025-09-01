import { body, param, query } from "express-validator";

export const validateCreateReview = [
  body('appId').notEmpty().withMessage('Review appId is required'),
  body('rating').notEmpty().withMessage('Review rating is required').isNumeric().withMessage('Review rating must be a number'),
  body('comment').notEmpty().withMessage('Review comment is required').isString().withMessage('Review comment must be a string'),
  body('reviewer').notEmpty().withMessage('Review reviewer is required').isString().withMessage('Review reviewer must be a string'),
  body('date').notEmpty().withMessage('Review date is required')
];

export const validateUpdateReview = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Review ID must be a positive integer'),
    
  body('appId').optional(),
  body('rating').optional().isNumeric().withMessage('Review rating must be a number'),
  body('comment').optional().isString().withMessage('Review comment must be a string'),
  body('reviewer').optional().isString().withMessage('Review reviewer must be a string'),
  body('date').optional()
];

export const validateGetReview = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Review ID must be a positive integer')
];

export const validateDeleteReview = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Review ID must be a positive integer')
];

export const validateGetReviews = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];
