import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import { EmployerModel } from '../models/employer.schema';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { body } = req;
  try {
    const existingEmployer = await EmployerModel.findOne({ email: body.email });
    if (existingEmployer) {
      res.status(400).send({ message: 'Employer already exists' });
    } else {
      const newEmployer = await EmployerModel.create(body);
      logger.debug(`Employer registered :${JSON.stringify(newEmployer)}`);
      res.status(201).send({ message: 'Employer created' });
    }
  } catch (error) {
    logger.error(error);
    next(boom.internal('Internal server error'));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { body } = req;
  res.send({ body });
};
