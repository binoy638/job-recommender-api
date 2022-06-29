import { Router } from 'express';

import { UserType } from '../@types';
import * as employerController from '../controllers/employer.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { userTypeValidator } from '../middlewares/userTypeValidator.middleware';
import { payloadValidator } from '../middlewares/validator.middleware';
import { jobAddValidator, jobUpdateValidator } from '../validators/job.validator';

const employerRouter = Router();

employerRouter.post(
  '/job',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  payloadValidator(jobAddValidator),
  employerController.addJob
);

employerRouter.get('/job', getCurrentUser, userTypeValidator(UserType.EMPLOYER), employerController.getJobs);

employerRouter.get('/job/:id', getCurrentUser, userTypeValidator(UserType.EMPLOYER), employerController.getJob);

employerRouter.put(
  '/job/:id',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  payloadValidator(jobUpdateValidator),
  employerController.updateJob
);

employerRouter.delete('/job/:id', getCurrentUser, userTypeValidator(UserType.EMPLOYER), employerController.deleteJob);

export default employerRouter;
