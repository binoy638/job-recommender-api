import { Router } from 'express';
import * as Yup from 'yup';

import { UserType } from '../@types';
import * as adminController from '../controllers/admin.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { userTypeValidator } from '../middlewares/userTypeValidator.middleware';
import { payloadValidator } from '../middlewares/validator.middleware';

const adminRouter = Router();

const employerIdValidator = { params: Yup.object().shape({ id: Yup.number().required() }) };
const addSkillBodyValidator = { body: Yup.object().shape({ name: Yup.string().required() }) };

adminRouter.put(
  '/employer/verify/:id',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  payloadValidator(employerIdValidator),
  adminController.verifyEmployer
);

adminRouter.put(
  '/employer/ban/:id',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  payloadValidator(employerIdValidator),
  adminController.banEmployer
);

adminRouter.post(
  '/skills',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  payloadValidator(addSkillBodyValidator),
  adminController.addSKill
);

adminRouter.post(
  '/jobcategory',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  payloadValidator(addSkillBodyValidator),
  adminController.addJobCategory
);

export default adminRouter;
