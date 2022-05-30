import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import * as Yup from 'yup';

import { RequestPayload } from '../@types';
import { RequestResponse, UserType } from '../@types/models.types';
import logger from '../config/logger';
import { employerValidator } from '../validators/employer.validator';
import { jobseekerValidator } from '../validators/jobseeker.validator';

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

export const loginValidator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    //* check if the request query contains the user type
    await Yup.object()
      .shape({
        utype: Yup.string().oneOf([UserType.EMPLOYER, UserType.JOBSEEKER, UserType.ADMIN]).required(),
      })
      .validate(req.query);

    //* check if the request body contains the email and password
    await Yup.object()
      .shape({
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(),
      })
      .validate(req.body);

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
    const isUTypeValid = await Yup.string().oneOf([UserType.EMPLOYER, UserType.JOBSEEKER]).required().isValid(utype);

    if (!isUTypeValid) {
      next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
      return;
    }

    if (utype === UserType.EMPLOYER) {
      await employerValidator.validate(req.body);
    }

    if (utype === UserType.JOBSEEKER) {
      await jobseekerValidator.validate(req.body);
    }
    next();
  } catch (error) {
    logger.error(error);
    next(boom.badRequest(RequestResponse.INVALID_PAYLOAD));
  }
};
