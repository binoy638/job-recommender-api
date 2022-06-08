import { Router } from 'express';

import * as testController from '../controllers/test.controller';

const testRouter = Router();

//* get all skills
testRouter.get('/employer-data', testController.getEmployerData);

//* get all job categories
testRouter.get('/jobseeker-data', testController.getJobSeekerData);

export default testRouter;
