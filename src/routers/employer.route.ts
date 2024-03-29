import { Router } from 'express';
import { z } from 'zod';

import { UserType } from '../@types';
import * as employerController from '../controllers/employer.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { userTypeValidator } from '../middlewares/userTypeValidator.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { ApplicationStatus } from '../models/jobApplication.schema';
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
  employerController.getJobApplication
);

employerRouter.put(
  '/profile-update',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ body: employerPostSchema.omit({ password: true }) }),
  employerController.profileUpdate
);

employerRouter.put(
  '/job/application/update-status/:id',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ params: ID, body: z.object({ status: z.nativeEnum(ApplicationStatus), jobID: z.string() }) }),
  employerController.changeJobApplicationStatus
);

employerRouter.post(
  '/chat/create',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ body: z.object({ jobseeker: z.string(), message: z.string() }) }),
  employerController.createChat
);

employerRouter.post(
  '/chat/send',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ body: z.object({ chatID: z.string(), message: z.string() }) }),
  employerController.sendMessage
);

employerRouter.put(
  '/chat/mark-as-read',
  getCurrentUser,
  userTypeValidator(UserType.EMPLOYER),
  validateRequest({ body: z.object({ chatID: z.string() }) }),
  employerController.maskAsReadMessage
);

employerRouter.get('/chat', getCurrentUser, userTypeValidator(UserType.EMPLOYER), employerController.getChat);

export default employerRouter;
