/* eslint-disable sonarjs/no-duplicate-string */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { Employer } from '../models/employer.schema';
import { JobCategory } from '../models/jobCategories.schema';
import { Skill } from '../models/skills.schema';

export const verifyEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const updatedEmployer = await Employer.findOneAndUpdate({ id }, { isVerified: true }, { new: true, lean: true });
    if (updatedEmployer) {
      res.status(204).send({ message: 'Verified Successfully' });
      return;
    }
    next(boom.notFound("Employer doesn't exist"));
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const banEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const updatedEmployer = await Employer.findOneAndUpdate({ id }, { isBanned: true }, { new: true, lean: true });
    if (updatedEmployer) {
      res.status(204).send({ message: 'Employer Banned' });
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
    const existingJobCategory = await JobCategory.findOne({ name });
    if (existingJobCategory) {
      next(boom.badData('Job Category already exists'));
      return;
    }
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
    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      next(boom.badRequest('Skill already exists'));
      return;
    }
    await Skill.create({ name });
    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getEmployers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //! pagination
    const employers = await Employer.find({}).select('-password -__v -_id').lean(true);
    res.status(200).send(employers);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
