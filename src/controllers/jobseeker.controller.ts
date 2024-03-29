import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { Pagination, RequestResponse } from '../@types';
import logger from '../config/logger';
import { Chat } from '../models/chat.schema';
import { JobApplication } from '../models/jobApplication.schema';
import { Job } from '../models/jobs.schema';
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
    const applications = await JobApplication.find({ jobSeeker: currentUser.id })
      .select('id job status createdAt')
      .populate([
        { path: 'job', select: 'id jobTitle employer applications', populate: { path: 'employer', select: 'company' } },
      ])
      .lean();
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
    const doc = await application.save();
    //* save the application id in the job document for easy access
    await Job.findByIdAndUpdate(body.job, { $push: { applications: doc._id } });

    res.sendStatus(201);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getJobSeekerProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  console.log({ id });
  try {
    const jobseeker = await JobSeeker.findOne({ id }).populate('skills');
    if (!jobseeker) {
      next(boom.notFound('JobSeeker not found'));
      return;
    }

    res.send({ profile: jobseeker });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { body, currentUser } = req;
  const msg = {
    message: body.message,
    sender: currentUser.id,
  };
  try {
    await Chat.findByIdAndUpdate(body.chatID, { $push: { messages: msg } });
    res.sendStatus(204);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const maskAsReadMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { body } = req;
  try {
    await Chat.findOneAndUpdate(
      { _id: body.chatID, 'message.$.unread': false, 'message.$.sender': 'employer' },
      { $set: { 'message.$.unread': true } }
    );
    res.sendStatus(204);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser } = req;
  try {
    const chat = await Chat.find({ jobseeker: currentUser.id })
      .populate([
        { path: 'jobseeker', select: 'firstName lastName' },
        { path: 'employer', select: 'firstName lastName' },
      ])
      .lean();
    res.send({ chat });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getJobRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { page } = req.query;
  const skipCount = (Number(page) - 1) * Number(Pagination.JOB_PAGE_SIZE);
  const { currentUser } = req;
  try {
    const jobSeeker = await JobSeeker.findOne({ id: currentUser.id }).populate('jobPreferences');
    if (!jobSeeker) {
      next(boom.notFound('JobSeeker not found'));
      return;
    }
    const recommendedJobs = await Job.find({
      category: { $in: jobSeeker.jobPreferences },
      // requiredSkills: { $in: jobSeeker.skills },
    })
      .populate([{ path: 'employer', select: 'company' }, { path: 'category' }, { path: 'requiredSkills' }])
      .skip(skipCount)
      .limit(Pagination.JOB_PAGE_SIZE)
      .lean();
    res.send({ recommendedJobs });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
