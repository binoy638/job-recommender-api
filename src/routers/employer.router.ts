import { Router } from 'express';

import * as EmployerController from '../controllers/employer.controller';

const employerRouter = Router();

employerRouter.get('/register', EmployerController.register);

export default employerRouter;
