import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { JobCategories } from '../models/jobCategories.schema';
import { Skills } from '../models/skills.schema';

//! need pagination support
export const getJobCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobCategories = await JobCategories.find({}).lean();
    res.send(jobCategories);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skills = await Skills.find({}).lean();
    res.send(skills);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
