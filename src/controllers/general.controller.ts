import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { JobCategory } from '../models/jobCategory.schema';
import { Skill } from '../models/skill.schema';

//! need pagination support
export const getJobCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobCategories = await JobCategory.find({}).lean();
    res.send(jobCategories);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const skills = await Skill.find({}).lean();
    res.send(skills);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
