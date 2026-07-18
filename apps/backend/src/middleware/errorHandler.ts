import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino();

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'An unexpected error occurred' : message
  });
}
