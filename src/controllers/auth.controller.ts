/* eslint-disable unicorn/no-null */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { RequestResponse, UserType } from '../@types';
import logger from '../config/logger';
import { Admin } from '../models/admin.schema';
import { Employer } from '../models/employer.schema';
import { JobSeeker } from '../models/jobseekers.schema';
import { EmployerFormData } from '../validators/employer.validator';
import { JobSeekerFormData } from '../validators/jobseeker.validator';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const utype = req.query.utype as UserType;

  if (utype !== UserType.EMPLOYER && utype !== UserType.JOBSEEKER) {
    next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
    return;
  }

  try {
    if (utype === UserType.EMPLOYER) {
      const { body }: { body: EmployerFormData } = req;
      const existingEmployer = await Employer.findOne({ email: body.email });
      if (existingEmployer) {
        next(boom.badRequest('Employer already exists'));
        return;
      }
      const newEmployer = Employer.build(body);
      await newEmployer.save();
      logger.debug(`Employer registered :${JSON.stringify(newEmployer)}`);
      const JWTtoken = jwt.sign(
        { id: newEmployer._id, utype: UserType.EMPLOYER, name: newEmployer.firstName },
        process.env.JWT_SECRET!
      );
      req.session = {
        jwt: JWTtoken,
      };
      res.status(201).send({ message: 'Registered Successfully' });
      return;
    }
    if (utype === UserType.JOBSEEKER) {
      const { body }: { body: JobSeekerFormData } = req;

      const existingJobSeeker = await JobSeeker.findOne({ email: body.email });
      if (existingJobSeeker) {
        next(boom.badRequest('JobSeeker already exists'));
        return;
      }
      const newJobSeeker = JobSeeker.build(body);
      await newJobSeeker.save();
      logger.debug(`JobSeeker registered :${JSON.stringify(newJobSeeker)}`);
      const JWTtoken = jwt.sign(
        { id: newJobSeeker._id, utype: UserType.JOBSEEKER, name: newJobSeeker.firstName },
        process.env.JWT_SECRET!
      );
      req.session = {
        jwt: JWTtoken,
      };
      res.status(201).send({ message: 'Registered Successfully' });
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
          {
            id: existingEmployer._id,
            utype: UserType.EMPLOYER,
            name: existingEmployer.firstName,
          },
          process.env.JWT_SECRET!
        );
        req.session = {
          jwt: JWTtoken,
        };
        res.status(200).send({ user: existingEmployer, type: UserType.EMPLOYER });
        return;
      }
      next(boom.unauthorized('Invalid email or password'));
      return;
    }
    if (utype === UserType.JOBSEEKER) {
      const existingJobSeeker = await JobSeeker.validateJobSeeker(email, password);
      if (existingJobSeeker) {
        const JWTtoken = jwt.sign(
          { id: existingJobSeeker._id, utype: UserType.JOBSEEKER, name: existingJobSeeker.firstName },
          process.env.JWT_SECRET!
        );
        req.session = {
          jwt: JWTtoken,
        };
        res.status(200).send({ user: existingJobSeeker, type: UserType.JOBSEEKER });

        return;
      }
      next(boom.unauthorized('Invalid email or password'));
      return;
    }
    const admin = await Admin.validateAdmin(email, password);
    if (admin) {
      const JWTtoken = jwt.sign(
        { id: admin._id, utype: UserType.ADMIN, name: admin.username },
        process.env.JWT_SECRET!
      );
      req.session = {
        jwt: JWTtoken,
      };
      res.status(200).send({ user: admin, type: UserType.ADMIN });

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

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser } = req;
  if (!currentUser) {
    next(boom.unauthorized('User not logged in'));
    return;
  }

  if (currentUser.utype === UserType.EMPLOYER) {
    const employer = await Employer.findById(currentUser.id).select('-password');
    if (!employer) {
      next(boom.notFound('User not found'));
      return;
    }
    res.status(200).send({ user: employer, type: UserType.EMPLOYER });
  }

  if (currentUser.utype === UserType.JOBSEEKER) {
    const jobSeeker = await JobSeeker.findById(currentUser.id).select('-password');
    if (!jobSeeker) {
      next(boom.notFound('User not found'));
      return;
    }
    res.status(200).send({ user: jobSeeker, type: UserType.JOBSEEKER });
  }

  if (currentUser.utype === UserType.ADMIN) {
    const admin = await Admin.findById(currentUser.id).select('-password');
    if (!admin) {
      next(boom.notFound('User not found'));
      return;
    }
    res.status(200).send({ user: admin, type: UserType.ADMIN });
  }
};

export const getSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser } = req;
  if (!currentUser) {
    next(boom.unauthorized('User not logged in'));
    return;
  }
  res.status(200).send({ session: currentUser });
};
