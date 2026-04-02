import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const jwtPassword = process.env.JWT_PASSWORD as string;

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers['authorization'];
  const decoded = jwt.verify(header as string, jwtPassword);

  if (decoded) {
    // @ts-ignore
    req.userId = decoded.id;
    next();
  } else {
    res.status(403).json({
      message: 'you are not logged in',
    });
  }
};
