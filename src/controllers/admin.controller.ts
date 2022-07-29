/* eslint-disable sonarjs/no-duplicate-string */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { Employer } from '../models/employer.schema';
import { JobCategory } from '../models/jobCategories.schema';
import { Job } from '../models/jobs.schema';
import { Skill } from '../models/skills.schema';

export enum EmployerFilter {
  ALL = 'all',
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
  BANNED = 'banned',
  UNBANNED = 'unbanned',
}

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
      next(boom.badData('Skill already exists'));
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
  const page = req.query.page as unknown as number;
  const limit = req.query.limit as unknown as number;
  const filter = req.query.filter as unknown as EmployerFilter;

  const skipIndex = (page - 1) * limit;

  let queryFilter: { isVerified?: boolean; isBanned?: boolean } = {};
  if (filter === EmployerFilter.VERIFIED) {
    queryFilter = { isVerified: true };
  }
  if (filter === EmployerFilter.UNVERIFIED) {
    queryFilter = { isVerified: false };
  }
  if (filter === EmployerFilter.BANNED) {
    queryFilter = { isBanned: true };
  }
  if (filter === EmployerFilter.UNBANNED) {
    queryFilter = { isBanned: false };
  }

  try {
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const employers = await Employer.find(queryFilter)
      .skip(skipIndex)
      .limit(limit)
      .select('-password -__v -_id')
      .lean(true);
    const count = await Employer.countDocuments(queryFilter);
    res.status(200).send({ employers, count });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const employer = await Employer.findOne({ id }).select('-password -__v -_id').lean();
    if (!employer) {
      next(boom.notFound("Employer doesn't exist"));
      return;
    }
    const jobs = await Job.find({ employer: employer._id }).populate('applications').lean();
    res.send({ employer, jobs });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
