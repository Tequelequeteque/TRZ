import { Request, Response, NextFunction } from 'express';
import ApiError from '../Utils/ApiError';

export default function GlobalExceptionHandler(
  error: Error,
  _request: Request,
  responde: Response,
  _next: NextFunction,
): Response {
  if (error instanceof ApiError) {
    return responde.status(error.statusCode).json(error);
  }
  console.log(error);
  const newError = new ApiError('Internal Server error', 500);
  return responde.status(newError.statusCode).json(newError);
}
