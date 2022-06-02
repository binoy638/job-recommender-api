import { Router } from 'express';
import * as Yup from 'yup';

import * as adminController from '../controllers/admin.controller';
import { payloadValidator } from '../middlewares/validator.middleware';

const adminRouter = Router();

const employerIdValidator = { params: Yup.object().shape({ employerId: Yup.number().min(12).max(12).required() }) };
const addSkillBodyValidator = { body: Yup.object().shape({ name: Yup.string().required() }) };

adminRouter.put('/employer/verify/:employerId', payloadValidator(employerIdValidator), adminController.verifyEmployer);
adminRouter.put('/employer/ban/employerId', payloadValidator(employerIdValidator), adminController.banEmployer);
adminRouter.post('/skills', payloadValidator(addSkillBodyValidator), adminController.addSKill);
adminRouter.post('/jobcategory', payloadValidator(addSkillBodyValidator), adminController.addJobCategory);
adminRouter.get('/skills', payloadValidator(addSkillBodyValidator), adminController.getSkills);
adminRouter.get('/jobcategory', payloadValidator(addSkillBodyValidator), adminController.getJobCategories);

export default adminRouter;
