import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestPayload } from '../@types';
import { RequestResponse, UserType } from '../@types/models.types';
import logger from '../config/logger';
import { employerLoginValidator, employerRegisterValidator } from '../validators/employer.validator';

export const payloadValidator =
  (requestPayload: RequestPayload) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (requestPayload.body) await requestPayload.body.validate(req.body);
      if (requestPayload.query) await requestPayload.query.validate(req.query);
      if (requestPayload.params) await requestPayload.params.validate(req.params);
      next();
    } catch (error) {
      logger.error(error);
      next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
    }
  };

export const authValidator =
  (
    requestPayload: RequestPayload,
    auth: { type: 'login' | 'registration'; user: UserType.EMPLOYER | UserType.JOBSEEKER }
  ) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userType } = req.body;
    if (!userType || userType !== UserType.EMPLOYER || userType !== UserType.JOBSEEKER) {
      next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
      return;
    }
    try {
      if (auth.user === UserType.EMPLOYER && userType === UserType.EMPLOYER) {
        if (auth.type === 'login' && employerLoginValidator.body) {
          await employerLoginValidator.body.validate(req.body);
        }
        if (auth.type === 'registration' && employerRegisterValidator.body) {
          await employerRegisterValidator.body.validate(req.body);
        }
      }

      next();
    } catch (error) {
      logger.error(error);
      next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
    }
  };
