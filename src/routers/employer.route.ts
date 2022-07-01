import { Router } from 'express';

import { UserType } from '../@types';
import * as employerController from '../controllers/employer.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { userTypeValidator } from '../middlewares/userTypeValidator.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { jobPostSchema } from '../validators/job.validator';

const employerRouter = Router();

employerRouter.get(
  '/status',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  employerController.getEmployerStatus
);

employerRouter.post(
  '/job',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ body: jobPostSchema }),
  employerController.addJob
);

employerRouter.get('/jobs', getCurrentUser, userTypeValidator(UserType.EMPLOYER), employerController.getJobs);

employerRouter.get('/job/:id', getCurrentUser, userTypeValidator(UserType.EMPLOYER), employerController.getJob);

employerRouter.put(
  '/job/:id',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ body: jobPostSchema }),
  employerController.updateJob
);

employerRouter.delete('/job/:id', getCurrentUser, userTypeValidator(UserType.EMPLOYER), employerController.deleteJob);

export default employerRouter;
