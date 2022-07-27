import { Router } from 'express';
import { z } from 'zod';

import { UserType } from '../@types';
import * as jobseekerController from '../controllers/jobseeker.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { userTypeValidator } from '../middlewares/userTypeValidator.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { ID } from '../validators';
import { JobApplicationPostSchema } from '../validators/job.validator';
import { jobseekerPostSchema } from '../validators/jobseeker.validator';

const jobseekerRouter = Router();

jobseekerRouter.get(
  '/applications',
  getCurrentUser,
  userTypeValidator(UserType.JOBSEEKER),
  jobseekerController.getApplications
);

jobseekerRouter.post(
  '/application',
  getCurrentUser,
  userTypeValidator(UserType.JOBSEEKER),
  validateRequest({ body: JobApplicationPostSchema }),
  jobseekerController.submitApplication
);

jobseekerRouter.put(
  '/profile',
  getCurrentUser,
  userTypeValidator(UserType.JOBSEEKER),
  validateRequest({ body: jobseekerPostSchema.omit({ password: true }) }),
  jobseekerController.profileUpdate
);

jobseekerRouter.get('/profile/:id', validateRequest({ params: ID }), jobseekerController.getJobSeekerProfile);

jobseekerRouter.post(
  '/chat/send',
  getCurrentUser,
  userTypeValidator(UserType.JOBSEEKER),
  validateRequest({ body: z.object({ id: z.string(), message: z.string() }) }),
  jobseekerController.sendMessage
);

jobseekerRouter.put(
  '/chat/mark-as-read',
  getCurrentUser,
  userTypeValidator(UserType.JOBSEEKER),
  validateRequest({ body: z.object({ id: z.string() }) }),
  jobseekerController.maskAsReadMessage
);

jobseekerRouter.get('/chat', getCurrentUser, userTypeValidator(UserType.JOBSEEKER), jobseekerController.getChat);

export default jobseekerRouter;
