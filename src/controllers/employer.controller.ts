/* eslint-disable sonarjs/no-duplicate-string */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { Employer } from '../models/employer.schema';
import { Job, JobDoc } from '../models/jobs.schema';

export const getEmployerStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser } = req;
  try {
    const employerStatus = await Employer.findById(currentUser.id).select('isVerified isBanned');
    console.log(employerStatus);
    if (!employerStatus) {
      next(boom.badRequest('employer does not exist'));
      return;
    }
    res.send({ status: employerStatus });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser } = req;
  try {
    const jobs = await Job.find({ employer: currentUser.id }).lean();
    res.send(jobs);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const addJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body as Omit<JobDoc, 'employer'>;
  const { currentUser } = req;

  try {
    const newJob = await Job.create({ ...body, employer: currentUser.id });
    res.status(201).send(newJob);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const job = await Job.findOne({ id }).lean();
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

export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body = req.body as Partial<JobDoc>;
  const { id } = req.params;
  const { currentUser } = req;
  try {
    const updatedJob = await Job.findOneAndUpdate({ id, employer: currentUser.id }, body, {
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

export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { currentUser } = req;

  try {
    const deletedJob = await Job.findOneAndDelete({ id, employer: currentUser.id });
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
