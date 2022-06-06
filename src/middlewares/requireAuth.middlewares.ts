/* eslint-disable @typescript-eslint/no-non-null-assertion */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.currentUser) {
    next(boom.unauthorized('User not logged in'));
    return;
  }

  next();
};
