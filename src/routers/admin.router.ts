import { Router } from 'express';
import { z } from 'zod';

import { UserType } from '../@types';
import * as adminController from '../controllers/admin.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { userTypeValidator } from '../middlewares/userTypeValidator.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { numberString } from './generalRouter';

const adminRouter = Router();

const employerIdValidator = { params: z.object({ id: numberString }) };
const addSkillBodyValidator = { body: z.object({ name: z.string() }) };

adminRouter.get(
  '/employers',
  getCurrentUser,
  validateRequest({
    query: z.object({
      page: numberString,
      limit: numberString,
      filter: z.nativeEnum(adminController.EmployerFilter),
    }),
  }),
  userTypeValidator(UserType.ADMIN),
  adminController.getEmployers
);

adminRouter.put(
  '/employer/verify/:id',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  validateRequest(employerIdValidator),
  adminController.verifyEmployer
);

adminRouter.get(
  '/employer/:id',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  validateRequest({ params: z.object({ id: numberString }) }),
  adminController.getEmployer
);

adminRouter.put(
  '/employer/ban/:id',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  validateRequest(employerIdValidator),
  adminController.banEmployer
);

adminRouter.post(
  '/skills',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  validateRequest(addSkillBodyValidator),
  adminController.addSKill
);

adminRouter.post(
  '/jobcategory',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  validateRequest(addSkillBodyValidator),
  adminController.addJobCategory
);

export default adminRouter;
