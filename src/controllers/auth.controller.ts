import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';

import { RequestResponse, UserType } from '../@types';
import { EmployerAttrs } from '../@types/employer.types';
import logger from '../config/logger';
import { Employer } from '../models/employer.schema';

const nanoid = customAlphabet('0123456789', 12);

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const utype = req.query.utype as UserType;

  if (utype !== UserType.EMPLOYER && utype !== UserType.JOBSEEKER) {
    next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
    return;
  }

  const { body }: { body: Omit<EmployerAttrs, 'employerId'> } = req;
  try {
    if (utype === UserType.EMPLOYER) {
      const existingEmployer = await Employer.findOne({ email: body.email });
      if (existingEmployer) {
        next(boom.badRequest('Employer already exists'));
      } else {
        const newEmployerInfo: EmployerAttrs = { ...body, employerId: Number(nanoid()) };
        const newEmployer = Employer.build(newEmployerInfo);
        await newEmployer.save();
        logger.debug(`Employer registered :${JSON.stringify(newEmployer)}`);
        res.status(201).send(newEmployer);
      }
    }
    if (utype === UserType.JOBSEEKER) {
      next(boom.badRequest('Admin registration not supported'));
    }
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
