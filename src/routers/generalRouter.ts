import { Router } from 'express';
import * as Yup from 'yup';

import * as generalController from '../controllers/general.controller';
import { payloadValidator } from '../middlewares/validator.middleware';

const generalRouter = Router();

//* get all skills
generalRouter.get(
  '/skills',
  payloadValidator({ query: Yup.object().shape({ q: Yup.string().required() }) }),
  generalController.searchSkills
);

//* get all job categories
generalRouter.get('/job-categories', generalController.getJobCategories);

export default generalRouter;
