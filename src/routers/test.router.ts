import { Router } from 'express';

import * as testController from '../controllers/test.controller';

const testRouter = Router();

//* get all skills
testRouter.get('/employer-data', testController.getRandomEmployerData);

//* get all job categories
testRouter.get('/jobseeker-data', testController.getRandomJobSeekerData);

testRouter.get('/job-data', testController.getRandomJobData);

export default testRouter;
