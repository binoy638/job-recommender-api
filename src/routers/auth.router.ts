import { Router } from 'express';
import { z } from 'zod';

import * as authController from '../controllers/auth.controller';
import { getCurrentUser } from '../middlewares/currentUser.middleware';
import { registrationValidator, validateRequest } from '../middlewares/validator.middleware';

const authRouter = Router();

authRouter.post('/signup', registrationValidator, authController.signup);
authRouter.post(
  '/signin',
  validateRequest({ body: z.object({ email: z.string().email(), password: z.string() }) }),
  authController.signin
);
authRouter.post('/signout', authController.signout);

//* this route gives all the information about the current user from db
authRouter.get('/current-user', getCurrentUser, authController.getCurrentUser);

//* this route gives only the id and type of user from cookie without fetching db
authRouter.get('/session', getCurrentUser, authController.getSession);

export default authRouter;
