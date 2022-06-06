import { Router } from 'express';
import * as Yup from 'yup';

import * as adminController from '../controllers/admin.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { isAdmin } from '../middlewares/isAdmin.middleware';
import { payloadValidator } from '../middlewares/validator.middleware';

const adminRouter = Router();

const employerIdValidator = { params: Yup.object().shape({ employerId: Yup.number().min(12).max(12).required() }) };
const addSkillBodyValidator = { body: Yup.object().shape({ name: Yup.string().required() }) };

//* verify employer
adminRouter.put(
  '/employer/verify/:employerId',
  getCurrentUser,
  isAdmin,
  payloadValidator(employerIdValidator),
  adminController.verifyEmployer
);

//* ban employer
adminRouter.put(
  '/employer/ban/employerId',
  getCurrentUser,
  isAdmin,
  payloadValidator(employerIdValidator),
  adminController.banEmployer
);

//* add skill
adminRouter.post('/skills', getCurrentUser, isAdmin, payloadValidator(addSkillBodyValidator), adminController.addSKill);

//* add job category
adminRouter.post(
  '/jobcategory',
  getCurrentUser,
  isAdmin,
  payloadValidator(addSkillBodyValidator),
  adminController.addJobCategory
);

export default adminRouter;
