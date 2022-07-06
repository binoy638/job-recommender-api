import { Router } from 'express';

import { UserType } from '../@types';
import * as employerController from '../controllers/employer.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { userTypeValidator } from '../middlewares/userTypeValidator.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { ID } from '../validators';
import { employerPostSchema } from '../validators/employer.validator';
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

employerRouter.get(
  '/job/:id',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ params: ID }),
  employerController.getJob
);

employerRouter.put(
  '/job/:id',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ body: jobPostSchema, params: ID }),
  employerController.updateJob
);

employerRouter.delete(
  '/job/:id',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ params: ID }),
  employerController.deleteJob
);

employerRouter.get(
  '/job/applications/:id',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ params: ID }),
  employerController.getJobApplications
);

employerRouter.get(
  '/job/application/:id',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ params: ID }),
  employerController.getJobApplications
);

employerRouter.put(
  '/profile-update',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ body: employerPostSchema.omit({ password: true }) }),
  employerController.profileUpdate
);

export default employerRouter;
