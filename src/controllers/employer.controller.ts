/* eslint-disable sonarjs/no-duplicate-string */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { Employer } from '../models/employer.schema';
import { JobApplication } from '../models/jobApplication.schema';
import { Job, JobDoc } from '../models/jobs.schema';

export const profileUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser, body } = req;
  try {
    const updatedEmployer = await Employer.findOneAndUpdate({ _id: currentUser.id }, body);
    if (!updatedEmployer) {
      next(boom.badRequest('employer does not exist'));
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getEmployerStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser } = req;
  try {
    const employerStatus = await Employer.findById(currentUser.id).select('isVerified isBanned');
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
    res.send({ jobs });
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

export const getJobApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const job = await Job.findOne({ id }).lean();
    if (!job) {
      next(boom.notFound('Job not found'));
      return;
    }
    const applications = await JobApplication.find({ job: job._id })
      .populate([{ path: 'jobSeeker', select: '-password', populate: { path: 'skills' } }])
      .lean();

    res.send({ applications });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getJobApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const application = await JobApplication.findOne({ id }).lean();

    res.send({ application });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const changeJobApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    //! check if the doc updated or not
    await JobApplication.findOneAndUpdate({ id }, { status });

    res.sendStatus(204);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
