import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

// import jwt from 'jsonwebtoken';
import logger from '../config/logger';

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authorizationHeader = req.header('authorization');
  const token = authorizationHeader && authorizationHeader.split(' ')[1];
  if (!token) {
    next(boom.unauthorized('Invalid token'));
    return;
  }
  try {
    // const user = jwt.verify(token, process.env.JWT_SECRET || '');
    // req.user = user;
    next();
  } catch (error) {
    logger.error(error);
    next(boom.unauthorized('Invalid token'));
  }
};
