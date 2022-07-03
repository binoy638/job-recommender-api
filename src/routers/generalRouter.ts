import { Router } from 'express';
import { z } from 'zod';

import * as generalController from '../controllers/general.controller';
import { validateRequest } from '../middlewares/validator.middleware';

const generalRouter = Router();

//* get all skills
generalRouter.get('/skills', validateRequest({ query: z.object({ q: z.string() }) }), generalController.searchSkills);

//* get all job categories
generalRouter.get('/job-categories', generalController.getJobCategories);

generalRouter.get(
  '/jobs',
  validateRequest({
    query: z.object({ page: z.string().regex(/^\d+$/).transform(Number), category: z.string().optional() }),
  }),
  generalController.getJobs
);

generalRouter.get(
  '/job/:id',
  validateRequest({
    params: z.object({ id: z.string().regex(/^\d+$/).transform(Number) }),
  }),
  generalController.getJob
);

generalRouter.get('/countries', generalController.getCountries);

generalRouter.get(
  '/states/:countryID',
  validateRequest({ params: z.object({ countryID: z.number() }) }),
  generalController.getStatesByCountry
);

generalRouter.get(
  '/cities/:stateID',
  validateRequest({ params: z.object({ stateID: z.number() }) }),
  generalController.getCitiesByState
);

export default generalRouter;
