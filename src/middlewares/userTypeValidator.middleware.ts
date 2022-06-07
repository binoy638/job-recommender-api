/* eslint-disable unicorn/consistent-function-scoping */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { UserType } from '../@types';

export const userTypeValidator =
  (userType: UserType) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { currentUser } = req;

    if (!currentUser || currentUser.utype !== userType) {
      next(boom.unauthorized('Not authorized'));
      return;
    }

    next();
  };
