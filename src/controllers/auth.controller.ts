import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';

import { RequestResponse, UserType } from '../@types';
import { EmployerAttrs } from '../@types/employer.types';
import { JobSeekerAttrs } from '../@types/jobseeker.types';
import logger from '../config/logger';
import { Employer } from '../models/employer.schema';
import { JobSeeker } from '../models/jobseeker.schema';

const nanoid = customAlphabet('0123456789', 12);

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const utype = req.query.utype as UserType;

  if (utype !== UserType.EMPLOYER && utype !== UserType.JOBSEEKER) {
    next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
    return;
  }

  try {
    if (utype === UserType.EMPLOYER) {
      const { body }: { body: Omit<EmployerAttrs, 'employerId'> } = req;
      const existingEmployer = await Employer.findOne({ email: body.email });
      if (existingEmployer) {
        next(boom.badRequest('Employer already exists'));
        return;
      }
      const newEmployerInfo: EmployerAttrs = { ...body, employerId: Number(nanoid()) };
      const newEmployer = Employer.build(newEmployerInfo);
      await newEmployer.save();
      logger.debug(`Employer registered :${JSON.stringify(newEmployer)}`);
      res.status(201).send(newEmployer);
      return;
    }
    if (utype === UserType.JOBSEEKER) {
      const { body }: { body: Omit<JobSeekerAttrs, 'jobSeekerId'> } = req;

      const existingJobSeeker = await JobSeeker.findOne({ email: body.email });
      if (existingJobSeeker) {
        next(boom.badRequest('JobSeeker already exists'));
        return;
      }
      const newJobSeekerInfo: JobSeekerAttrs = { ...body, jobSeekerId: Number(nanoid()) };
      const newJobSeeker = JobSeeker.build(newJobSeekerInfo);
      await newJobSeeker.save();
      logger.debug(`JobSeeker registered :${JSON.stringify(newJobSeeker)}`);
      res.status(201).send(newJobSeeker);
      return;
    }

    next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    const employer = await Employer.validateEmployer(email, password);
    if (employer) {
      const JWTtoken = jwt.sign({ id: employer.employerId }, process.env.JWT_SECRET || '');
      req.session = {
        jwt: JWTtoken,
      };
      res.status(200).send({ token: JWTtoken, user: employer });
    } else {
      next(boom.unauthorized('Invalid email or password'));
    }
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
