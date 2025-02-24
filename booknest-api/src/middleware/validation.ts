import { Request, Response, NextFunction } from 'express';

export const validateMember = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, phone } = req.body;
  
  if (!name || !email) {
    res.status(400).json({
      error: 'Validation failed',
      details: 'Name and email are required'
    });
    return;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid email format'
    });
    return;
  }

  next();
};

export const validateBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, category_id, collection_id } = req.body;
  
  if (!name || !category_id || !collection_id) {
    res.status(400).json({
      error: 'Validation failed',
      details: 'Name, category, and collection are required'
    });
    return;
  }

  next();
};

export const validateIssuance = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { book_id, member_id, return_date } = req.body;
  
  if (!book_id || !member_id || !return_date) {
    res.status(400).json({
      error: 'Validation failed',
      details: 'Book ID, member ID, and return date are required'
    });
    return;
  }

  const returnDateObj = new Date(return_date);
  if (isNaN(returnDateObj.getTime())) {
    res.status(400).json({
      error: 'Validation failed',
      details: 'Invalid return date format'
    });
    return;
  }

  next();
}; 