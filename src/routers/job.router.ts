import { Router } from 'express';
import * as Yup from 'yup';

import { UserType } from '../@types';
import * as jobController from '../controllers/job.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { requireAuth } from '../middlewares/requireAuth.middlewares';
import { userTypeValidator } from '../middlewares/userTypeValidator.middleware';
import { payloadValidator } from '../middlewares/validator.middleware';
import { jobAddValidator, jobUpdateValidator } from '../validators/job.validator';

const jobRouter = Router();

jobRouter.post(
  '/',
  getCurrentUser,
  requireAuth,
  userTypeValidator(UserType.EMPLOYER),
  payloadValidator(jobAddValidator),
  jobController.addJob
);

jobRouter.get('/', jobController.getJobs);

jobRouter.put(
  '/:id',
  getCurrentUser,
  requireAuth,
  userTypeValidator(UserType.EMPLOYER),
  payloadValidator(jobUpdateValidator),
  jobController.updateJob
);

jobRouter.get(
  '/:id',
  payloadValidator({ params: Yup.object().shape({ id: Yup.string().required() }) }),
  jobController.getJob
);

jobRouter.delete(
  '/:id',
  getCurrentUser,
  requireAuth,
  userTypeValidator(UserType.EMPLOYER),
  payloadValidator({ params: Yup.object().shape({ id: Yup.string().required() }) }),
  jobController.deleteJob
);

export default jobRouter;
