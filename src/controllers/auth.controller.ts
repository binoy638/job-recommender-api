/* eslint-disable unicorn/no-null */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';

import { RequestResponse, UserType } from '../@types';
import { EmployerAttrs } from '../@types/employer.types';
import { JobSeekerAttrs } from '../@types/jobseeker.types';
import logger from '../config/logger';
import { Admin } from '../models/admin.schema';
import { Employer } from '../models/employer.schema';
import { JobSeeker } from '../models/jobseeker.schema';

const nanoid = customAlphabet('0123456789', 12);

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      const JWTtoken = jwt.sign({ id: newEmployer.employerId, utype: UserType.EMPLOYER }, process.env.JWT_SECRET!);
      req.session = {
        jwt: JWTtoken,
      };
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
      const JWTtoken = jwt.sign({ id: newJobSeeker.jobSeekerId, utype: UserType.JOBSEEKER }, process.env.JWT_SECRET!);
      req.session = {
        jwt: JWTtoken,
      };
      res.status(201).send(newJobSeeker);
      return;
    }

    next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  const utype = req.query.utype as UserType;

  try {
    if (utype === UserType.EMPLOYER) {
      const existingEmployer = await Employer.validateEmployer(email, password);
      if (existingEmployer) {
        const JWTtoken = jwt.sign(
          { id: existingEmployer.employerId, utype: UserType.EMPLOYER },
          process.env.JWT_SECRET!
        );
        req.session = {
          jwt: JWTtoken,
        };
        res.status(200).send({ user: existingEmployer });
        return;
      }
      next(boom.unauthorized('Invalid email or password'));
      return;
    }
    if (utype === UserType.JOBSEEKER) {
      const existingJobSeeker = await JobSeeker.validateJobSeeker(email, password);
      if (existingJobSeeker) {
        const JWTtoken = jwt.sign(
          { id: existingJobSeeker.jobSeekerId, utype: UserType.JOBSEEKER },
          process.env.JWT_SECRET!
        );
        req.session = {
          jwt: JWTtoken,
        };
        res.status(200).send({ user: existingJobSeeker });
        return;
      }
      next(boom.unauthorized('Invalid email or password'));
      return;
    }
    const admin = await Admin.validateAdmin(email, password);
    if (admin) {
      const JWTtoken = jwt.sign({ id: admin.email, utype: UserType.ADMIN }, process.env.JWT_SECRET!);
      req.session = {
        jwt: JWTtoken,
      };
      res.status(200).send({ user: admin });
      return;
    }
    next(boom.unauthorized('Invalid email or password'));
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const signout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    req.session = null;
    res.send({});
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  res.send({ currentUser: req?.currentUser || null });
};
