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

export const searchSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const query = req.query.q;
  try {
    const skills = await Skills.aggregate([
      {
        $search: {
          index: 'skills-index',

          autocomplete: {
            query,
            path: 'name',
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      },
      {
        $limit: 10,
      },
    ]);
    res.send(skills);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
