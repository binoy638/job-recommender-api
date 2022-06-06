import { Router } from 'express';

import * as generalController from '../controllers/general.controller';

const generalRouter = Router();

//* get all skills
generalRouter.get('/skills', generalController.getSkills);

//* get all job categories
generalRouter.get('/job-categories', generalController.getJobCategories);

export default generalRouter;
