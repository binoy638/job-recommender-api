import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { requireAuth } from '../middlewares/requireAuth.middlewares';
import { loginValidator, registrationValidator } from '../middlewares/validator.middleware';

const authRouter = Router();

authRouter.post('/signup', registrationValidator, authController.signup);
authRouter.post('/signin', loginValidator, authController.signin);
authRouter.post('/signout', getCurrentUser, requireAuth, authController.signout);
authRouter.get('/current-user', getCurrentUser, authController.getCurrentUser);

export default authRouter;
