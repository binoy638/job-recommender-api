import { Router } from 'express';
import { z } from 'zod';

import * as generalController from '../controllers/general.controller';
import { validateRequest } from '../middlewares/validator.middleware';

const generalRouter = Router();

const numberString = z.string().regex(/^\d+$/).transform(Number);

//* get all skills
generalRouter.get('/skills', validateRequest({ query: z.object({ q: z.string() }) }), generalController.searchSkills);

//* get all job categories
generalRouter.get('/job-categories', generalController.getJobCategories);

generalRouter.get(
  '/jobs',
  validateRequest({
    query: z.object({ page: numberString, category: z.string().optional() }),
  }),
  generalController.getJobs
);

generalRouter.get(
  '/job/:id',
  validateRequest({
    params: z.object({ id: numberString }),
  }),
  generalController.getJob
);

generalRouter.get('/countries', generalController.getCountries);

generalRouter.get(
  '/states/:countryID',
  validateRequest({ params: z.object({ countryID: numberString }) }),
  generalController.getStatesByCountry
);

generalRouter.get(
  '/cities/:stateID',
  validateRequest({ params: z.object({ stateID: numberString }) }),
  generalController.getCitiesByState
);

export default generalRouter;
