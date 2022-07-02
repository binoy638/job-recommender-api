import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { RequestPayload, RequestResponse, UserType } from '../@types';
import logger from '../config/logger';
import { employerPostSchema } from '../validators/employer.validator';
import { jobseekerPostSchema } from '../validators/jobseeker.validator';

export const validateRequest =
  (requestPayload: RequestPayload) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (requestPayload?.body) await requestPayload.body.parseAsync(req.body);
      if (requestPayload?.query) await requestPayload.query.parseAsync(req.query);
      if (requestPayload?.params) await requestPayload.params.parseAsync(req.params);
      next();
    } catch (error) {
      logger.error(error);
      next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
    }
  };

export const registrationValidator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const utype = req.query.utype as UserType;
  try {
    //* check if utype is valid
    await z.nativeEnum(UserType).parseAsync(utype);

    if (utype === UserType.EMPLOYER) {
      await employerPostSchema.parseAsync(req.body);
    }

    if (utype === UserType.JOBSEEKER) {
      await jobseekerPostSchema.parseAsync(req.body);
    }
    next();
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
  }
};
