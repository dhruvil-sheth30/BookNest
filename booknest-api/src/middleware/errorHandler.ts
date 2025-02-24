import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  details?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  const details = err.details || undefined;

  res.status(status).json({
    error: message,
    details,
    path: req.path,
    timestamp: new Date().toISOString()
  });
}; 