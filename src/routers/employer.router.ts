import { Router } from 'express';

import * as EmployerController from '../controllers/auth.controller';
import { payloadValidator } from '../middlewares/validator.middleware';
import { employerLoginValidator, employerRegisterValidator } from '../validators/employer.validator';

const employerRouter = Router();

employerRouter.post('/register', payloadValidator(employerRegisterValidator), EmployerController.register);
employerRouter.post('/login', payloadValidator(employerLoginValidator), EmployerController.login);

export default employerRouter;
