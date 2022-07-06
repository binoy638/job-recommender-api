import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { JobApplication } from '../models/jobApplication.schema';
import { JobSeeker } from '../models/jobseekers.schema';

export const profileUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser, body } = req;
  try {
    const updatedJobSeeker = await JobSeeker.findOneAndUpdate({ _id: currentUser.id }, body);
    if (!updatedJobSeeker) {
      next(boom.badRequest('jobseeker does not exist'));
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser } = req;
  try {
    const applications = await JobApplication.find({ jobSeeker: currentUser.id }).populate('job').lean();

    res.send({ applications });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const submitApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser, body } = req;
  try {
    const existingApplication = await JobApplication.findOne({ job: body.job, jobSeeker: currentUser.id });

    if (existingApplication) {
      next(boom.badRequest('You have already applied for this job'));
      return;
    }

    const application = new JobApplication({ ...body, jobSeeker: currentUser.id });
    await application.save();

    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
