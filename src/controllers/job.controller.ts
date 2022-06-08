/* eslint-disable sonarjs/no-duplicate-string */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import { JobAttrs } from '../@types/job.types';
import logger from '../config/logger';
import { Jobs } from '../models/jobs.schema';

export const addJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body as Omit<JobAttrs, 'employer'>;
  const { currentUser } = req;
  try {
    const newJob = await Jobs.create({ ...body, employer: currentUser.id });
    res.status(201).send(newJob);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body as Partial<JobAttrs>;
  const { id } = req.params;
  const { currentUser } = req;
  try {
    const updatedJob = await Jobs.findOneAndUpdate({ id, employer: currentUser.id }, body, {
      new: true,
      lean: true,
    });
    if (!updatedJob) {
      next(boom.notFound('Job not found'));
      return;
    }
    res.status(204).send(updatedJob);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const job = await Jobs.findOne({ id }).lean();
    if (!job) {
      next(boom.notFound('Job not found'));
      return;
    }
    res.send(job);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

//! need pagination support
export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobs = await Jobs.find({}).lean();
    res.send(jobs);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { currentUser } = req;

  try {
    const deletedJob = await Jobs.findOneAndDelete({ id, employer: currentUser.id });
    if (!deletedJob) {
      next(boom.notFound('Job not found'));
      return;
    }
    res.status(204).send(deletedJob);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
