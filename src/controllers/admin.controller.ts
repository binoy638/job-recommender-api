/* eslint-disable sonarjs/no-duplicate-string */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { Employer } from '../models/employer.schema';
import { JobCategory } from '../models/jobCategories.schema';
import { Skill } from '../models/skills.schema';

export const verifyEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { employerId } = req.params;
  try {
    const updatedEmployer = await Employer.findByIdAndUpdate(
      employerId,
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
    const updatedEmployer = await Employer.findByIdAndUpdate(employerId, { isBanned: true }, { new: true, lean: true });
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
    await JobCategory.create({ name });
    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const addSKill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name } = req.body;
  try {
    await Skill.create({ name });
    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
