/* eslint-disable sonarjs/no-duplicate-string */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { Employers } from '../models/employers.schema';
import { JobCategories } from '../models/jobCategories.schema';
import { Skills } from '../models/skills.schema';

export const verifyEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employerId } = req.params;
  try {
    const updatedEmployer = await Employers.findOneAndUpdate(
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
    const updatedEmployer = await Employers.findOneAndUpdate(
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

export const addJobCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name } = req.body;
  try {
    await JobCategories.create({ name });
    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const addSKill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name } = req.body;
  try {
    await Skills.create({ name });
    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
