import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import { loginValidator, registrationValidator } from '../middlewares/validator.middleware';

const authRouter = Router();

authRouter.post('/signup', registrationValidator, authController.signup);
authRouter.post('/signin', loginValidator, authController.signin);
authRouter.post('/signout', authController.signout);

export default authRouter;
