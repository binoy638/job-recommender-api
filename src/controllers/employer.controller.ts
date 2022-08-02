/* eslint-disable sonarjs/no-duplicate-string */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { Chat } from '../models/chat.schema';
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
  const { status, jobID } = req.body;
  try {
    const job = await Job.findOne({ id: jobID }).lean();
    if (!job) {
      next(boom.notFound('Job not found'));
      return;
    }
    await JobApplication.findOneAndUpdate({ job: job._id, id: Number(id) }, { status });

    res.sendStatus(204);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const createChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { jobseeker, message } = req.body;
  const { currentUser } = req;

  const msg = {
    message,
    sender: currentUser.id,
  };

  try {
    const chatExist = await Chat.findOne({ employer: currentUser.id, jobseeker });

    if (chatExist) {
      await Chat.findOneAndUpdate({ employer: currentUser.id, jobseeker }, { $push: { messages: msg } });
      res.sendStatus(204);
      return;
    }
    await Chat.create({ employer: currentUser.id, jobseeker, messages: [msg] });
    res.sendStatus(201);
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
  const { body, currentUser } = req;
  try {
    const s = await Chat.findById(body.chatID);
    console.log(s);
    await Chat.findOneAndUpdate(
      { _id: body.chatID, 'messages.unread': true, 'messages.sender': { $ne: currentUser.id } },
      { $set: { 'messages.$.unread': false } }
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
    const chat = await Chat.find({ employer: currentUser.id })
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
