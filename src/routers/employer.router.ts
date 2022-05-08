import { Router } from 'express';

import * as EmployerController from '../controllers/employer.controller';
import { validator } from '../middlewares/validator.middleware';
import { employerRegisterValidator } from '../validators/employer.validator';

const employerRouter = Router();

employerRouter.post('/register', validator(employerRegisterValidator), EmployerController.register);

export default employerRouter;
