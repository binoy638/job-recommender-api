import { Router } from 'express';
import { z } from 'zod';

import * as generalController from '../controllers/general.controller';
import { getCurrentUserOptional } from '../middlewares/currentUser.middleware';
import { validateRequest } from '../middlewares/validator.middleware';
import { jobSearchSchema } from '../validators/job.validator';

const generalRouter = Router();

export const numberString = z.string().regex(/^\d+$/).transform(Number);

//* get all skills
generalRouter.get(
  '/search/skills',
  validateRequest({ query: z.object({ q: z.string() }) }),
  generalController.searchSkills
);

generalRouter.get(
  '/skills',
  validateRequest({ query: z.object({ page: numberString, limit: numberString }) }),
  generalController.getSkills
);

//* get all job categories
generalRouter.get('/job-categories', generalController.getJobCategories);

generalRouter.get(
  '/jobs',
  getCurrentUserOptional,
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

generalRouter.get('/search/jobs', validateRequest({ query: jobSearchSchema }), generalController.searchJobs);

export default generalRouter;
