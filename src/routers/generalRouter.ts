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

generalRouter.get('/countries', generalController.getCountries);

generalRouter.get(
  '/states/:countryID',
  payloadValidator({ params: Yup.object().shape({ countryID: Yup.number().required() }) }),
  generalController.getStatesByCountry
);

generalRouter.get(
  '/cities/:stateID',
  payloadValidator({ params: Yup.object().shape({ stateID: Yup.number().required() }) }),
  generalController.getCitiesByState
);

export default generalRouter;
