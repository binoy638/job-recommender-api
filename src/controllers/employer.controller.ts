import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import logger from '../config/logger';
import { Employer } from '../models/employer.schema';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { body } = req;
  try {
    const existingEmployer = await Employer.findOne({ email: body.email });
    if (existingEmployer) {
      next(boom.badRequest('Employer already exists'));
    } else {
      const newEmployer = await Employer.create(body);
      logger.debug(`Employer registered :${JSON.stringify(newEmployer)}`);
      res.status(201).send({ message: 'Employer created' });
    }
  } catch (error) {
    logger.error(error);
    next(boom.internal('Internal server error'));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    const employer = await Employer.validateEmployer(email, password);
    if (employer) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const token = jwt.sign({ _id: employer._id }, process.env.JWT_SECRET!);

      res.status(200).send({ token, user: employer });
    } else {
      next(boom.unauthorized('Invalid email or password'));
    }
  } catch (error) {
    logger.error(error);
    next(boom.internal('Internal server error'));
  }
};
