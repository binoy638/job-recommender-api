import { Router } from 'express';

import * as adminController from '../controllers/admin.controller';
import { payloadValidator } from '../middlewares/validator.middleware';
import * as Yup from 'yup';

const adminRouter = Router();

const employerIdValidator = { params: Yup.object().shape({ employerId: Yup.number().min(12).max(12).required() }) };

adminRouter.post('/employer/verify/:employerId', payloadValidator(employerIdValidator), adminController.verifyEmployer);
adminRouter.post('/employer/ban/employerId', payloadValidator(employerIdValidator), adminController.banEmployer);

export default adminRouter;
