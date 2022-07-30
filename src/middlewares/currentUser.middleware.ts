/* eslint-disable @typescript-eslint/no-non-null-assertion */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserType } from '../@types';
import logger from '../config/logger';

interface UserPayload {
  id: string;
  utype: UserType;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser: UserPayload;
    }
  }
}

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.session?.jwt) {
    next(boom.unauthorized('Not authorized'));
    return;
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET!) as UserPayload;
    req.currentUser = payload;
    next();
  } catch (error) {
    logger.error(error);
    next(boom.unauthorized('Not authorized'));
  }
};

export const getCurrentUserOptional = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.session?.jwt) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET!) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
    logger.error(error);
  }
  next();
};
