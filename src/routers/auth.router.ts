import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import { loginValidator, registrationValidator } from '../middlewares/validator.middleware';

const employerRouter = Router();

employerRouter.post('/register', registrationValidator, authController.register);
employerRouter.post('/login', loginValidator, authController.login);

export default employerRouter;
