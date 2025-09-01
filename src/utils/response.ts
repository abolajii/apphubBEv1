import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  statusCode: number;
}

interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  errors?: any
): Response => {
  const response: ApiResponse<T> = {
    success,
    message,
    statusCode,
    ...(data && { data }),
    ...(errors && { errors })
  };

  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Operation completed successfully',
  statusCode: number = 200
): Response => {
  return sendResponse(res, statusCode, true, message, data);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => {
  return sendResponse(res, 201, true, message, data);
};

export const sendInternalServerError = (
  res: Response,
  message: string = 'Internal server error',
  errors?: any
): Response => {
  return sendResponse(res, 500, false, message, undefined, errors);
};

export const sendNotFound = (
  res: Response,
  message: string = 'Resource not found',
  errors?: any
): Response => {
  return sendResponse(res, 404, false, message, undefined, errors);
};

export const sendBadRequest = (
  res: Response,
  message: string = 'Bad request',
  errors?: any
): Response => {
  return sendResponse(res, 400, false, message, undefined, errors);
};

export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized access',
  errors?: any
): Response => {
  return sendResponse(res, 401, false, message, undefined, errors);
};

export const sendValidationError = (
  res: Response,
  errors: any,
  message: string = 'Validation failed'
): Response => {
  return sendResponse(res, 422, false, message, undefined, errors);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Data retrieved successfully'
): Response => {
  const totalPages = Math.ceil(total / limit);
  
  const response: PaginatedResponse<T[]> = {
    success: true,
    message,
    data,
    statusCode: 200,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };

  return res.status(200).json(response);
};

export default {
  sendSuccess,
  sendCreated,
  sendInternalServerError,
  sendNotFound,
  sendBadRequest,
  sendUnauthorized,
  sendValidationError,
  sendPaginated
};
