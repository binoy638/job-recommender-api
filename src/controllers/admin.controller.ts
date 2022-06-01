import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { Employer } from '../models/employer.schema';

export const verifyEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employerId } = req.params;
  try {
    const updatedEmployer = await Employer.findOneAndUpdate(
      { employerId },
      { isVerified: true },
      { new: true, lean: true }
    );
    if (updatedEmployer) {
      res.sendStatus(204);
      return;
    }
    next(boom.notFound("Employer doesn't exist"));
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const banEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employerId } = req.params;
  try {
    const updatedEmployer = await Employer.findOneAndUpdate(
      { employerId },
      { isBanned: true },
      { new: true, lean: true }
    );
    if (updatedEmployer) {
      res.sendStatus(204);
      return;
    }
    next(boom.notFound("Employer doesn't exist"));
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
