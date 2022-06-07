import { Router } from 'express';
import * as Yup from 'yup';

import { UserType } from '../@types';
import * as adminController from '../controllers/admin.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { userTypeValidator } from '../middlewares/userTypeValidator.middleware';
import { payloadValidator } from '../middlewares/validator.middleware';

const adminRouter = Router();

const employerIdValidator = { params: Yup.object().shape({ employerId: Yup.number().min(12).max(12).required() }) };
const addSkillBodyValidator = { body: Yup.object().shape({ name: Yup.string().required() }) };

//* verify employer
adminRouter.put(
  '/employer/verify/:employerId',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  payloadValidator(employerIdValidator),
  adminController.verifyEmployer
);

//* ban employer
adminRouter.put(
  '/employer/ban/employerId',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  payloadValidator(employerIdValidator),
  adminController.banEmployer
);

//* add skill
adminRouter.post(
  '/skills',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  payloadValidator(addSkillBodyValidator),
  adminController.addSKill
);

//* add job category
adminRouter.post(
  '/jobcategory',
  getCurrentUser,
  userTypeValidator(UserType.ADMIN),
  payloadValidator(addSkillBodyValidator),
  adminController.addJobCategory
);

export default adminRouter;
